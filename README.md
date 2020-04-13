# Asociatie

* [x] Instalare Angular
* [x] Definit bara de navigare
* [x] Definit Componentan Home
* [x] Creat view pentru componenta Home
  * [x] Creat modal ( popup ) pentru Adauga, Editeaza si Setari
  * [x] Creat table pentru listare consum
  * [x] Creat functie de stergere a consumului
  * [x] Creat functie de vizualizare raport al consului (utilizand ca referinta consumul anterior)
* [x] Creat CSS de printare pentru raport
* [x] Toate datele sunt salvate in WebSQL utilizand serviciul *web-sql.service.ts*
* [x] Intializare dropdown folosind directivele Angular

## Pachete necesare
* Node LTS (am folosit v.12)
* Acest proiect a fost generat cu [Angular CLI](https://github.com/angular/angular-cli) versiunea 9.1.0
* Web server (Apache sau Nginx pentru versiunea de productie)

## Instalare Angular CLI
> npm install -g @angular/cli

## Cum pornesti proiectul in faza de testare
> ng serve

## Cum faci build-ul pentru productie
> ng build
#### Build pentru productie avand calea de baza diferite de **/**
> ng build --base-href /LOCATIE/
- Folosind aceasta comanda de build calea proiectului pe serverul de productie trebuie sa fie `http://localhost/LOCATIE/`

## Demo LIVE
> [Acceseaza acest Link](https://colocaust.dev/proiect/asociatie/)

## Altele

Pentru mai multe detalii utilizati comanda de ajutor Angular CLI `ng help` sau accesati [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
