# weblocacao-views
Extensão do Weblocacao.com.br com tela para ficar em televisão na área das costureiras apresentando entregas e provas da semana

## Usage

* Create a docker-compose.yml file

```yml
version: '3.7'

services:

  weblocacao-extensions:
    image: flaviostutz/weblocacao-extensions
    ports:
      - 8181:80
```

* Run 'docker-compose up'

* Open 'http://localhost:8181'

* Login com seu usuário/senha Weblocação

