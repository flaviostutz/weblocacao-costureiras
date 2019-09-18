FROM flaviostutz/nginx-cache-proxy:1.6.0

ADD /src /www/_www

ENV REDIR_FROM_PATH /dashboard/dash
ENV PROXY_PASS_URL https://www.weblocacao.com.br/
ENV PROXY_COOKIE_DOMAIN www.weblocacao.com.br localhost

