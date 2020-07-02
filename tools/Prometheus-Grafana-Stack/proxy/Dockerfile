FROM envoyproxy/envoy:v1.12.0

ARG TARGET_SITE

COPY ./envoy.yaml /etc/envoy/envoy.yaml
RUN sed -i "N;s/{{TARGET_SITE}}/${TARGET_SITE}/" /etc/envoy/envoy.yaml
