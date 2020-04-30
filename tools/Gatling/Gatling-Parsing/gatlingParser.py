import json
import pandas as pd
import codecs
import os
from bs4 import BeautifulSoup
from elasticsearch5 import Elasticsearch 
from elasticsearch5 import RequestsHttpConnection
from datetime import datetime, timedelta, date
from time import gmtime,strftime
import time

class MyConnection(RequestsHttpConnection):
    def __init__(self, *args, **kwargs):
        proxies = kwargs.pop('proxies', {})
        super(MyConnection, self).__init__(*args, **kwargs)
        self.session.proxies = proxies
        self.session.verify = False

proxies = {}  # {'https': 'http://127.0.0.1:8888'}



try: 
  elasticURL = os.environ['ELASTIC_URL']
  reportResultsToElasticsearch = os.environ['ELASTIC_ACTIVATE']
except: 
  reportResultsToElasticsearch = 'FALSE'

print(elasticURL)
print(reportResultsToElasticsearch)

if reportResultsToElasticsearch == 'TRUE':
  es = Elasticsearch([elasticURL], http_compress=True,
                    send_get_body_as='POST', connection_class=MyConnection, proxies=proxies, timeout=600)

  es.indices.put_template(name='gatling', body='''{
  "order": 0,
  "version": 1,
  "template": "gatling-*",
  "settings": {
    "index": {
      "number_of_shards": "1",
      "codec": "default",
      "refresh_interval": "5s"
    }
  },
  "mappings": {
    "_default_": {
      "numeric_detection": true,
      "dynamic_templates": [
        {
          "message_field": {
            "path_match": "message",
            "mapping": {
              "norms": false,
              "type": "text"
            },
            "match_mapping_type": "string"
          }
        },
        {
          "string_fields": {
            "mapping": {
              "norms": false,
              "type": "text",
              "fields": {
                "keyword": {
                  "ignore_above": 256,
                  "type": "keyword"
                }
              }
            },
            "match_mapping_type": "string",
            "match": "*"
          }
        }
      ],
      "_all": {
        "norms": false,
        "enabled": true
      },
      "properties": {
        "@timestamp": {
          "include_in_all": false,
          "type": "date"
        },
        "geoip": {
          "dynamic": true,
          "properties": {
            "ip": {
              "type": "ip"
            },
            "latitude": {
              "type": "half_float"
            },
            "location": {
              "type": "geo_point"
            },
            "longitude": {
              "type": "half_float"
            }
          }
        },
        "@version": {
          "include_in_all": false,
          "type": "keyword"
        }
      }
    }
  },
  "aliases": {}
  }''')


  template = {
      'test_name': "testName",
      '@timestamp': "timeNow",
      'metric': 'percentile',
      'value': 13,
  }

  dateNow = time.strftime("%Y-%m-%d", time.gmtime())
  template['@timestamp']= time.strftime("%Y-%m-%dT%H:%M:%Sz", time.gmtime())

# Function to sort the final array by the mean
def Sort(sub_li): 
    sub_li.sort(reverse = True, key = lambda x: x[3]) 
    return sub_li 

# Find a string between two strings in a string
def find_between(s):
    begin = "data-content='"
    end = "\'>\");"
    return (s[s.find(begin)+len(begin):s.rfind(end)])

try:
   os.mkdir("./report")
except OSError as e:
   print("Directory exists")

# Getting a list of all folders in the results directory. The dictonary will serve to 
# save the variable names where each folder will be loaded. 
listOfTestFolders = next(os.walk('./results'))[1]
folderNameVariablesNumeric = {}
folderNameVariablesString = {}

# Read the benchmarks from the json file
with open('./benchmarks.json', 'r') as f:
    benchmarks = json.load(f)

# Load all the data from stats and index.html
for i in range(len(listOfTestFolders)): 
    folderName = listOfTestFolders[i]
    with open('./results/' + folderName + '/js/stats.json', 'r') as file:
        folderNameVariablesNumeric['-'.join(folderName.split('-')[0:-1])] = file.read()
    with open('./results/' + folderName + '/index.html','r') as file: 
        folderNameVariablesString[folderName.split('-')[0] + '/html'] = file.read()

finalArray = []
arr1 = []
for folderName,value in folderNameVariablesNumeric.items(): 
    jsonObj = json.loads(value)
    l1 = []
    l1.append(jsonObj['stats']['name'] + ' ' + folderName)
    l1.append(jsonObj['stats']['numberOfRequests']['total'])
    l1.append(jsonObj['stats']['minResponseTime']['total'])
    l1.append(jsonObj['stats']['maxResponseTime']['total'])
    l1.append(jsonObj['stats']['meanResponseTime']['total'])
    l1.append(jsonObj['stats']['standardDeviation']['total'])
    l1.append(jsonObj['stats']['percentiles1']['total'])
    l1.append(jsonObj['stats']['percentiles2']['total'])
    l1.append(jsonObj['stats']['percentiles3']['total'])
    l1.append(jsonObj['stats']['percentiles4']['total'])
    l1.append(str(jsonObj['stats']['group1']['percentage']))
    l1.append(str(jsonObj['stats']['group2']['percentage']))
    l1.append(str(jsonObj['stats']['group3']['percentage']))
    l1.append(str(jsonObj['stats']['group4']['percentage']))
    l1.append(jsonObj['stats']['meanNumberOfRequestsPerSecond']['total'])
    l1.append(' ')
    arr1.append(l1)

    if reportResultsToElasticsearch == 'TRUE':
      print("Pushing to ElasticSearch")
      header = ['Name', "Request count", "Min response time", "Max response time", "Mean response time", "Std deviation", "Response time 50th percentile", "Response time 75th percentile", "Response time 95th percentile", "Response time 99th percentile","800 ms < t < 1200 ms", "t < 800 ms", "t > 1200 ms", "Failed Percentage", "Reqs/s"]

      template['test_name'] = l1[0]
      for i in range(1,len(header)): 
          template['metric'] = header[i]
          template['value'] = int(l1[i])
          res = es.index(index='gatling-'+str(dateNow), doc_type='gatling', body=template)

    
finalArray.append(arr1)

header = [['Name', "Request count", "Min response time", "Max response time", "Mean response time", "Std deviation", "Response time 50th percentile", "Response time 75th percentile", "Response time 95th percentile", "Response time 99th percentile","800 ms < t < 1200 ms", "t < 800 ms", "t > 1200 ms", "Failed Percentage", "Reqs/s"]]
whiteRow = [[' ', ' ', ' ', ' ', ' ']]
finalArray.insert(0, header)
my_df = pd.DataFrame()
for i in range(len(finalArray)):
    my_df = my_df.append((pd.DataFrame(finalArray[i])))

my_df.to_csv('./report/globalReport.csv', index=False, header=0)


finalArray = []
# Go through all the folders and stats.json and index.html and extract the values
for folderName,value in folderNameVariablesNumeric.items(): 
    jsonObj = json.loads(value)
    fields = [] 
    arr1 = []

    for key,value in jsonObj['contents'].items(): 
        fields.append(key)

    for element in fields:
        l1 = []
        l1.append(jsonObj['contents'][element]['stats']['name'])
        l1.append(jsonObj['contents'][element]['stats']['percentiles3']['total'])
        l1.append(jsonObj['contents'][element]['stats']['percentiles4']['total'])
        l1.append(jsonObj['contents'][element]['stats']['meanResponseTime']['total'])
        l1.append('ms')

        try: 
            apiName = jsonObj['contents'][element]['stats']['name']
            bound = str(benchmarks[apiName + ' Lower bound']) + "-" + str(benchmarks[apiName + ' Upper bound'])
            l1.append(bound)

            
            if (l1[2]>benchmarks[apiName + ' Upper bound']):
                l1.append("Bad")

            elif(l1[3]<benchmarks[apiName + ' Lower bound']):
                l1.append("Good")

            else: 
                l1.append("Normal")

        except: 
            print("No benchmark was found for " + apiName)
            l1.append("")


        arr1.append(l1)

    arr1 = Sort(arr1)
    testName = find_between(folderNameVariablesString[folderName + '/html'])
    header = [[testName, "95th Percentile", "99th Percintile", "Mean", "Units", "Benchmark", "Status"]]
    whiteRow = [[' ', ' ', ' ', ' ', ' ']]
    arr1 = header + arr1 + whiteRow
    finalArray.append(arr1)



my_df = pd.DataFrame()
for i in range(len(finalArray)):
    my_df = my_df.append((pd.DataFrame(finalArray[i])))

my_df.to_csv('./report/report.csv', index=False, header=0)
