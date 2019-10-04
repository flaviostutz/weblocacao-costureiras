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

## Prepare a Raspberry-Pi based toten

* Get a Raspberry-Pi kit
  * Board, case, power adapter, 32GB micro sd card, HDMI monitor, keyboard and a mouse

* Install Raspbian to SD Card
  * https://www.raspberrypi.org/downloads/raspbian/
  * Choose the Desktop version (~1.2 GB) image
  * Burn image to SD card using Etcher or some other utility

* Bootup Raspberry
  * Change root password
  * Configure WIFI connection

* Install Docker + docker-compose
  * https://withblue.ink/2019/07/13/yes-you-can-run-docker-on-raspbian.html
  * The installation process will take a while

