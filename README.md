# Translator wykładów

## Cel projektu

Celem projektu jest stworzenie aplikacji wspierającej studentów obcojęzycznych w uczestnictwie w wykładach, które są realizowane wyłącznie w języku polskim. Aplikacja będzie służyła jako narzędzie do tłumaczenia na żywo wykładów na język angielski oraz umożliwiała tworzenie notatek na podstawie wykładu.

Aplikacja po stronie wykładowcy będzie najpierw zamieniała tekst na mowę, potem na język angielski, aby przekazywać ją dalej do studentów. Dodatkowo wykładowcy będą mogli zamieszczać swoje prezentacje w aplikacji, aby studenci mogli je śledzić u siebie oraz zamieszczać slajdy w notatkach.

Studenci będą tworzyć notatki przez umieszczanie fragmentów przetłumaczonej transkrypcji, dodawanie swojego własnego tekstu oraz zamieszczanie obrazów czy slajdów z prezentacji. Po utworzeniu notatek będą mogli umieścić zakładki oraz podkreślenia aby notatki były bardziej przejrzyste. Podczas tworzenia notatek zautomatyzowane będzie dodawanie informacje na temat daty, nazwy przedmiotu oraz tematu wykładu.

Dodatkowo podczas wykładu na żywo studenci za pomocą aplikacji będą mogli zadawać pytania w języku angielskim, które będą przetłumaczone i przekazane wykładowcy aby mógł na nie odpowiedzieć.

Główną motywacją do projektu jest udostępnienie studentom spoza Polski możliwości
uczestnictwa w przedmiotach oferowanych przez Politechnikę Warszawską, które są
prowadzone tylko w języku polskim.


## starting the application
the following tutorial assumes that your setup is windows => wsl2 => docker containers
the docker-compose for api-frontend will work without any needed changes if the setup is different, however the docker-compose for microphone will need to be rewritten depending no your setup.

## starting api + frontend

### add firewall + proxy rules
add a firewall rule to allow tcp connections to port 3000 and port 5000

in terminal with administrator rights:
ipconfig - find wsl2 ipv4 address
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=[wsl2ip]
netsh interface portproxy add v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=[wsl2ip]

keep in mind, ubuntu on wsl2 address changes every time you reboot wsl, so you need to readd the rule everytime after reset (might change? after testing this does not seem to be true)

### install npm + node

need to have npm, node installed

### start frontend + api
in your wsl2 terminal:
navigate to the folder you want to clone to
git clone https://github.com/PZSP2-translator/lecture-translator.git
navigate to app folder
copy the "password" file to it
navigate to frontend folder
```npm install``` (before first use)
navigate to build-api-frontend folder
chmod +x build.sh
./build.sh [address of your computer in local network (if using windows to wsl setup, the windows address)]
example - ./build.sh 192.168.1.1

## starting microphone

in your wsl2 terminal:
navigate to the folder you want to clone to
git clone https://github.com/PZSP2-translator/lecture-translator.git
navigate to build-microphone
```docker-compose up --build```

docker exec -it PZSP06_microphone python3 main.py [lecture_id] [server_ip_address]


#### known issues:
if starting docker-compose in wsl returns "Error while fetching server API version: Not supported URL scheme http+docker"
it's possible you are using a currently broken version of python requests. if so, downgrade it with:
pip install requests==2.31.0