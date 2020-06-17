FROM traefik:latest

ARG TARGET_SITE

COPY ./traefik.yml /etc/traefik/traefik.yml
COPY ./dynamic_config.yml /etc/traefik/dynamic_config.yml
RUN sed -i "s/{{TARGET_SITE}}/${TARGET_SITE}/g" /etc/traefik/dynamic_config.yml
