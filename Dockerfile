FROM flaviostutz/nginx-cache-proxy:1.7.7

RUN apt-get update && apt-get install gettext -y

ADD /src /www/_www
ADD /startup2.sh /

ENV REDIR_FROM_PATH /dashboard
ENV REDIR_FROM_PATH2 /operationaldash
ENV PROXY_PASS_URL https://www.weblocacao.com.br/
ENV PROXY_COOKIE_DOMAIN www.weblocacao.com.br localhost

ENV WEEKLY_VIEW_TIME 15
ENV WEEKLY2_VIEW_TIME 5
ENV MONTHLY_VIEW_TIME 5

CMD [ "/startup2.sh" ]