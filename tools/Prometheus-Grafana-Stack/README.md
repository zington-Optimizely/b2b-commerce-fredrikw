**TL;DR,** a starting point for analyzing ISC's Prometheus metrics:
1. Edit `.env` with the domain and Prometheus exporter credentials of a target ISC site
2. Run `docker-compose up --build`
3. Browse to http://localhost:3001/d/QrXgpZCZz/performance-dashboard

# Prometheus-Grafana Stack
The Prometheus-Grafana Stack is a combination of tools that can be used to collect timing data on pipes, pipelines, handlers, and handler chains in ISC. This way if any of these is performing slower than it should be, we will be able to notice it and graph it.

# Architecture 
Prometheus is an open-source monitoring system with a dimensional data model and an efficient time-series database. Grafana is also an open-source project that is used to visualize metrics. Combined they make a powerful tool to track metrics.  

![Performance Presentation](https://user-images.githubusercontent.com/49656548/79552136-3b665780-8060-11ea-8f74-13ee0d68a77f.png)

The diagram above shows a high-level diagram of the architecture of the Prometheus-Grafana Stack. Metric exporters are injected into ISC and that allows the metrics to be exposed. Prometheus pulls those metrics and logs them. After Prometheus has logged the metrics, Grafana can connect with and receive data from Prometheus and create the dashboards.

Prometheus includes the port in the host header when requesting metrics, which can cause issues with certain networking configurations. To work around this, the requests are routed through a local Envoy proxy that strips the port from the host header.

# Setup 
Follow these steps to have the Prometheus-Grafana stack running locally. You might have some of these steps already completed. 

## Prerequisites 

* Git
* Docker Desktop
* Get ISC up and running locally ([Documentation](https://support.insitesoft.com/hc/en-us/articles/360025291711-InsiteCommerce-Cloud-Environment-Setup-for-Developers))


## Installation and setup for ISC
The following steps will ensure that the metrics are being exposed and that they can be seen inside a docker image. 

Steps: 
1. Open IIS click add binding, and add **host.docker.internal** in your bindings, and then do the same process with **host.docker.internal** but now in Https mode. 
2. In {local ISC dev url}/admin go to websites and click on **Edit** for the Main Website. Under add domains, add host.docker.internal. This exposes Prometheus exporter endpoints to images within the Docker network. 
3. Refer to [Insite Help](https://support.insitesoft.com/hc/en-us/articles/360034897011-Prometheus) for information on how to enable, disable, and configure Prometheus within ISC. (changes to the exporter username/password will necessitate updating prometheus/prometheus.yml)
4. The metrics endpoint is {local ISC dev url}/api/v1/admin/metrics. The default credentials are "[MetricsUsername]" and "[MetricsPassword]".


## Running Prometheus-Grafana Stack

Run `docker-compose up --build`

The output should show If you now run `docker ps`, it should show the currently running Prometheus and Grafana

The default config is setup such that:
* Prometheus is running at **localhost:9090**
* Grafana is running at **localhost:3001**
* Prometheus is pulling metrics from ISC at host.docker.internal/api/v1/admin/metrics
* Grafana is connected to Prometheus.

# Use case example 
After adding a new feature test the performance of the website ensure everything is working and performant.

This generates the timing data for pipes and handlers. Developers can go and dig into the data that Prometheus has provided by going to localhost:9090. Prometheus has a querying language called [PromQl](https://prometheus.io/docs/prometheus/latest/querying/basics/). 
For this specific use case, you might want to see how much time each specific pipe, pipeline, handler and handler chain is taking, and you can do that one of these two ways: 

1. Navigate to Prometheus and run this query: `(sum without () (isc_duration_seconds_sum)) / (sum without () (isc_duration_seconds_count))`

2. Go to Grafana
* On the left side go under Dashboards
* Click manage dashboards
* Navigate to the monitoring folder
* Click on the Performance dashboard


# Making Changes to the Stack
Advanced users might want to add their data sources for Prometheus, or might want to add their dashboards for Grafana. Doing this is quite easy. Below you will find a quick explanation of the structure for both Prometheus and Grafana folders, as well as instruction as to how to make changes 

## Prometheus
The file *prometheus.yml*, in the Prometheus folder is used to configure Prometheus. Here you can add new jobs, change the data sources, change passwords for basic authentication and so on.  

### Creating a new job or changing data sources
In *prometheus.yml*  file you will be able to add a new job, with a different data source, and your config. To create a new job all you have to do is open the *prometheus.yml* file and under **scrape_configs** add a new job. This will include at a minimum you adding **job_name** and **static_configs**. The **static_configs** will include a target which is just the URL where your metrics are exposed. 

Here you might have to change the **scheme: https** if you are using a website that requires https. In the *prometheus.yml* file in will be able to change the **username** or **password** for basic authentication. For more help about Prometheus please see the official [documentation](https://prometheus.io/docs/concepts/jobs_instances/).



## Grafana
From version 5.0 Grafana has added a feature called provisioning. This allows users to have things such as dashboards, or data sources preloaded as you create the Grafana image. A lot of the pre-configuration for Grafana will be done under the Grafana folder. That will include setting rights for users and organizations, adding data sources, and much more. Now let's look at some basic things. 


### Adding dashboards
Adding dashboards should be extremely simple. If you have dashboards that you created and would like to use just copy your dashboards.json file and pass it in **./grafana/provisioning/dashboards** in your local machine. If you pass it in an already existing folder, the dashboard will be automatically added. 

If you would like to add a new folder you have to first create a folder in **./grafana/provisioning/dashboards**, and then reference that folder in **./grafana/provisioning/dashboards/dashboard.yml**.  This will load the specific dashboard folder in your Grafana instance. 

### Adding data sources 
Adding more data sources is similarly very easy. Go under **./grafana/provisioning/datasources** and open *datasource.yml* file. There you can add a new data source. The file is documented well and adding a new source should be easy if you just follow the instructions. For more help please see the official [documentation](https://grafana.com/docs/administration/provisioning/)


## Troubleshooting

### Time drift of Hyper-v 
When your computer goes to sleep, the time in your VM and the time in your computer will go out of synch. To fix that issue please run the following commands in Powershell as Administrator:

`Get-VMIntegrationService -VMName DockerDesktopVM -Name "Time Synchronization" | Disable-VMIntegrationService`

`Get-VMIntegrationService -VMName DockerDesktopVM -Name "Time Synchronization" | Enable-VMIntegrationService`
