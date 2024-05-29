# Translator wykładów

## Cel projektu

Celem projektu jest stworzenie aplikacji wspierającej studentów obcojęzycznych w uczestnictwie w wykładach, które są realizowane wyłącznie w języku polskim. Aplikacja będzie służyła jako narzędzie do tłumaczenia na żywo wykładów na język angielski oraz umożliwiała tworzenie notatek na podstawie wykładu.

Aplikacja po stronie wykładowcy będzie najpierw zamieniała tekst na mowę, potem na język angielski, aby przekazywać ją dalej do studentów. Dodatkowo wykładowcy będą mogli zamieszczać swoje prezentacje w aplikacji, aby studenci mogli je śledzić u siebie oraz zamieszczać slajdy w notatkach.

Studenci będą tworzyć notatki przez umieszczanie fragmentów przetłumaczonej transkrypcji, dodawanie swojego własnego tekstu oraz zamieszczanie obrazów czy slajdów z prezentacji. Po utworzeniu notatek będą mogli umieścić zakładki oraz podkreślenia aby notatki były bardziej przejrzyste. Podczas tworzenia notatek zautomatyzowane będzie dodawanie informacje na temat daty, nazwy przedmiotu oraz tematu wykładu.

Dodatkowo podczas wykładu na żywo studenci za pomocą aplikacji będą mogli zadawać pytania w języku angielskim, które będą przetłumaczone i przekazane wykładowcy aby mógł na nie odpowiedzieć.

Główną motywacją do projektu jest udostępnienie studentom spoza Polski możliwości
uczestnictwa w przedmiotach oferowanych przez Politechnikę Warszawską, które są
prowadzone tylko w języku polskim.


## To run docker

needed to have npm, node installed

następnie z poziomu folderu translator/frontend:

```npm start```

### starting microphone
the docker-compose assumes that your setup is windows => WSL2 = > docker containers, you will most likely have to edit the microphone container, if your setup is different

in your wsl2 terminal:
navigate to the folder you want to clone to
git clone https://github.com/PZSP2-translator/lecture-translator.git
navigate to build-microphone
```docker-compose up --build```

docker exec -it PZSP06_microphone python3 microphone.py [lecture_number] [server_ip_address]

# starting api + frontend

### add firewall + proxy rules
add a firewall rule to allow tcp connections to port 3000 and port 5000

keep in mind, ubuntu on wsl2 address changes every time you reboot wsl, so you need to readd the rule everytime after reset

in terminal with administrator rights
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=[wsl2ip]
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=[wsl2ip]

in your wsl2 terminal:
navigate to the folder you want to clone to
git clone https://github.com/PZSP2-translator/lecture-translator.git
navigate to frontend folder
```npm install``` (przy pierwszym uruchomieniu)
navigate to build-api-frontend folder
chmod +x build.sh
./build.sh