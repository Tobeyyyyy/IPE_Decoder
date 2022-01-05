## Prerequisites

- Local Docker installation
- [Deno.js](https://deno.land/manual/getting_started/installation)
- nodejs version 10.4.0 (or later)

## Installation

    // (If you run into errors while running `npm install isolated-vm`
    //  it is likely you don't have a compiler set up, or your compiler is too old)
    sudo apt-get install python g++ build-essential

    npm i

    cd src/docker/
    npm i
    docker build -t decoder .

## Running

    npm start -- --d isolatedVM --b latency

    --d     : Decoder, values: common, nativ, eval, docker, vm2, isolatedVM, denoVM
    --b     : Benchmark, values: latency, throughput, memory
    --c     : Number of instances, default: 1

## Sicherheitsanalyse

| Kriterium                                | vm2                                                                                                                                        | isolated-vm                                                                                                                        | deno-vm                                                                                            | docker (gVisor)                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Isolierter Kontext                       | ✓                                                                                                                                          | ✓                                                                                                                                  | ✓                                                                                                  | ✓                                                                                                                  |
| Netzwerkschnittstellen                   | ✓ Zugriff auf Netzwerkmodule (http, tcp) muss manuell erlaubt werden                                                                       | ✓ Zugriff auf Netzwerkmodule (http, tcp) muss manuell erlaubt werden                                                               | ✓ mit `--allow-net` wird lediglich nur die Kommunikation zurück zum Host erlaubt                   | ✓ mit `--network none` werden alle Netzwerkschnittstellen des Containers entfernt                                  |
| Kein Zugriff auf das Dateisystem         | ✓ Zugriff auf das fs-modul muss explizit gewährt werden                                                                                    | ✓ Zugriff auf das fs-modul muss explizit gewährt werden                                                                            | ✓ ohne `--allow-read` kann deno nicht auf das Dateisystem zugreifen                                | ✓ Container besitzen ein von dem Host getrenntes eigenes Dateisystem                                               |
| Umgebungsvariablen                       | ✓ Sandbox besitzt überschriebenes `process`-Objekt                                                                                         | ✓ Dem Kontext wird kein `process`-Objekt bereitgestellt                                                                            | ✓ Der Zugriff muss mit `--allow-env` explizit erteilt werden                                       | ✓ Umgebungsvariablen des Hostsystems können nicht innerhalb des Containers eingesehen werden                       |
| Keine Kontrolle über den eigenen Prozess | ✓ Das überschriebene `proccess`-Objekt beinhaltet keine Informationen oder Methoden                                                        | ✓ Dem Kontext wird kein `process`-Objekt bereitgestellt                                                                            | X Über das globale `Deno`-Objekt kann der Prozess beendet werden                                   | X Über das globale `process`-Objekt kann der Prozess beendet werden                                                |
| Timeout                                  | ✓ `timeout` in Millisekunden kann dem Konfigurationsobjekt übergeben werden. Nach dem Timeout wird die Ausführung mit einem Fehler beendet | ✓ eine `timeout`-property kann jedem Script-Aufruf übergeben werden. Nach dem Timeout wird die Ausführung mit einem Fehler beendet | X Es kann kein Timeout für die Ausführung konfiguriert werden.                                     | X Es kann kein Timeout für die Ausführung konfiguriert werden. (Timeout kann also nur von dem Host erkannt werden) |
| Speicherbegrenzung                       | X Da die Kontexte nicht in eigenen Threads laufen, kann vm2 nicht erkennen/eingrenzen, wie viel Arbeitsspeicher verwendet wird             | ✓ Dem V8-Isolate kann die Eigenschaft `memoryLimit` in MB übergeben werden.                                                        | ✓ Über den Flag `--v8-flags=--max-old-space-size=8` kann der Arbeitspeicher in MB begrenzt werden. | ✓ Über `--memory=8` kann bei `docker run` der Arbeitsspeicher des Containers begrenzt werden.                      |
