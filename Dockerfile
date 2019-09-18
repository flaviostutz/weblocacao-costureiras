FROM nginx:1.17.0

ADD /default.conf /etc/nginx/conf.d/
ADD /startup.sh /

ADD /src /www

ENV WEBLOCACAO_USERNAME ''
ENV WEBLOCACAO_PASSWORD ''

CMD ["/startup.sh"]
