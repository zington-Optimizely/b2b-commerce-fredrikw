FROM prom/prometheus:v2.17.1

ARG METRICS_USERNAME
ARG METRICS_PASSWORD

COPY ./prometheus.yml /etc/prometheus/
RUN sed -i "N;s/{{METRICS_USERNAME}}/${METRICS_USERNAME}/" /etc/prometheus/prometheus.yml
RUN sed -i "N;s/{{METRICS_PASSWORD}}/${METRICS_PASSWORD}/" /etc/prometheus/prometheus.yml
