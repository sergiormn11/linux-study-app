/* =====================================================================
   Terminal de Estudio · Linux — DATOS DE LA GUÍA
   ---------------------------------------------------------------------
   Este archivo contiene TODOS tus apuntes estructurados por módulo.
   La app lo carga automáticamente la primera vez (o al reiniciar datos).

   CÓMO AMPLIAR:
   - Cada apunte es un objeto dentro de STUDY_NOTES.
   - Campos: id, moduleId, type, difficulty, title, body, answer, tags.
   - type: teoria | comando | ejemplo | error | tip | pregunta | ejercicio
   - moduleId: debe coincidir con un id de STUDY_MODULES.
   - En body/answer puedes usar formato ligero:
       ```  bloque de código  ```
       `código en línea`
       **negrita**
   Cuando te pasen apuntes nuevos, se añaden aquí como objetos más.
   ===================================================================== */

/* ---------------------------------------------------------------------
   MÓDULOS (temario). El número marca el orden en la barra lateral.
   ------------------------------------------------------------------- */
const STUDY_MODULES = [
  { id: 'm01', num: 1,  name: 'Terminal, shell y comandos básicos', completed: false },
  { id: 'm02', num: 2,  name: 'Flujos, procesos y descriptores',    completed: false },
  { id: 'm03', num: 3,  name: 'Permisos y notación octal',          completed: false },
  { id: 'm04', num: 4,  name: 'Usuarios y grupos',                  completed: false },
  { id: 'm05', num: 5,  name: 'Permisos especiales y atributos',    completed: false },
  { id: 'm06', num: 6,  name: 'Capabilities',                       completed: false },
  { id: 'm07', num: 7,  name: 'Estructura de directorios (FHS)',    completed: false },
  { id: 'm08', num: 8,  name: 'Shell: personalización y texto',     completed: false },
  { id: 'm09', num: 9,  name: 'Gestión de paquetes (APT)',          completed: false },
  { id: 'm10', num: 10, name: 'Tmux y Kitty',                       completed: false },
  { id: 'm11', num: 11, name: 'Búsquedas con find',                 completed: false },
  { id: 'm12', num: 12, name: 'Scripting en Bash',                  completed: false },
  { id: 'm13', num: 13, name: 'Vim',                                completed: false },
  { id: 'm14', num: 14, name: 'Repaso: preguntas de examen',        completed: false },
];

/* ---------------------------------------------------------------------
   APUNTES
   ------------------------------------------------------------------- */
const STUDY_NOTES = [

  /* ================================================================
     MÓDULO 1 — Terminal, shell y comandos básicos
     ================================================================ */
  {
    id: 'g001', moduleId: 'm01', type: 'teoria', difficulty: 'basico',
    title: '¿Qué es una shell?',
    body: 'Una **shell** (intérprete de comandos, p. ej. `bash` o `zsh`) es un programa que:\n\n1. Lee lo que el usuario escribe (una línea de texto).\n2. La interpreta como un comando, con sus argumentos y opciones (flags).\n3. Busca el programa correspondiente en el sistema de archivos (normalmente en rutas listadas en la variable de entorno `$PATH`).\n4. Lo ejecuta como un proceso y muestra el resultado.\n\nTodo lo demás (permisos, redirección, procesos en segundo plano) gira en torno a cómo la shell lanza y comunica estos procesos entre sí.',
    answer: '', tags: ['shell', 'conceptos']
  },
  {
    id: 'g002', moduleId: 'm01', type: 'teoria', difficulty: 'basico',
    title: 'Definición de proceso',
    body: 'Un **proceso** es una instancia en ejecución de un programa. Cada proceso tiene un identificador único (**PID**, Process ID) y hereda un contexto de usuario (UID/GID) que determina qué puede hacer.',
    answer: '', tags: ['procesos', 'conceptos']
  },
  {
    id: 'g003', moduleId: 'm01', type: 'comando', difficulty: 'basico',
    title: 'Comandos de lectura, filtrado y localización',
    body: '`cat archivo` → muestra el contenido de un archivo por pantalla.\n`echo "texto"` → imprime una cadena (o la redirige a un archivo).\n`comando | grep "patrón"` → filtra líneas que contienen un patrón.\n`comando | grep "patrón" -n` → igual, pero muestra el número de línea.\n`command -v programa` → devuelve la ruta absoluta de un ejecutable.\n`ls -l` → listado largo: permisos, dueño, grupo, tamaño, fecha.\n\n```\n$ cat /etc/group | grep "floppy"\nfloppy:x:25:kali\n\n$ command -v whoami\n/usr/bin/whoami\n```',
    answer: '', tags: ['cat', 'grep', 'ls']
  },
  {
    id: 'g004', moduleId: 'm01', type: 'tip', difficulty: 'intermedio',
    title: 'grep es más potente de lo que parece',
    body: '`grep` acepta expresiones regulares, no solo texto literal. Por ejemplo, `grep -E "^root"` busca solo líneas que **empiecen** por "root". Es una herramienta que reaparece constantemente en administración de sistemas, análisis de logs y ciberseguridad.',
    answer: '', tags: ['grep', 'regex']
  },
  {
    id: 'g005', moduleId: 'm01', type: 'teoria', difficulty: 'intermedio',
    title: 'El archivo /etc/passwd: base de datos de usuarios',
    body: 'Cada línea tiene **7 campos separados por `:`**\n\n```\nroot:x:0:0:root:/root:/usr/bin/zsh\n```\n\n1. Nombre de usuario\n2. Marcador de contraseña (la real está cifrada en `/etc/shadow`)\n3. UID — identificador numérico del usuario\n4. GID — identificador numérico del grupo principal\n5. Comentario / nombre completo (GECOS)\n6. Directorio home\n7. Shell de login asignada',
    answer: '', tags: ['passwd', 'usuarios']
  },
  {
    id: 'g006', moduleId: 'm01', type: 'tip', difficulty: 'intermedio',
    title: 'Por qué /etc/passwd importa en ciberseguridad',
    body: '`/etc/passwd` es legible por cualquier usuario (a diferencia de `/etc/shadow`, solo para root). Por eso es de los primeros archivos que se revisan en la fase de **enumeración** de un sistema: revela qué usuarios existen, cuáles tienen shell interactiva (posible vector de ataque) y cuáles son cuentas de servicio sin login (`/usr/sbin/nologin`).\n\nConvención de UIDs:\n- **0** → siempre root (superusuario).\n- **1–999** → usuarios de sistema/servicio.\n- **1000+** → usuarios normales creados por un administrador.',
    answer: '', tags: ['passwd', 'seguridad', 'enumeracion']
  },

  /* ================================================================
     MÓDULO 2 — Flujos, procesos y descriptores
     ================================================================ */
  {
    id: 'g007', moduleId: 'm02', type: 'teoria', difficulty: 'basico',
    title: 'Los tres flujos estándar',
    body: 'Todo proceso nace con tres canales abiertos, identificados por número:\n\n- **0 · stdin** (Standard Input) → entrada de datos (teclado por defecto).\n- **1 · stdout** (Standard Output) → salida normal del programa.\n- **2 · stderr** (Standard Error) → mensajes de error.\n\nSe separan stdout y stderr para poder tratar por separado el resultado útil y los errores (ej. guardar la salida válida y descartar los errores).',
    answer: '', tags: ['flujos', 'stdin', 'stdout', 'stderr']
  },
  {
    id: 'g008', moduleId: 'm02', type: 'comando', difficulty: 'basico',
    title: 'Operadores para encadenar comandos',
    body: '`cmd1 ; cmd2` → ejecuta ambos siempre, pase lo que pase.\n`cmd1 && cmd2` → ejecuta cmd2 **solo si** cmd1 tuvo éxito (código 0).\n`cmd1 || cmd2` → ejecuta cmd2 **solo si** cmd1 falló (código ≠ 0).\n\n```\n$ whoami; ls        # ambos se ejecutan siempre\n$ whoami && ls       # ls solo si whoami tuvo éxito\n$ whoam || ls        # whoam falla -> por eso SÍ se ejecuta ls\n```',
    answer: '', tags: ['operadores', 'and', 'or']
  },
  {
    id: 'g009', moduleId: 'm02', type: 'teoria', difficulty: 'intermedio',
    title: 'Código de salida (exit status)',
    body: 'Cada comando devuelve un número entero al terminar, accesible con `$?`. **0 significa éxito**; cualquier otro valor (1–255) indica error. `&&` y `||` se basan en este valor, no en si el comando "existe" — un comando que existe pero falla en su lógica también devuelve código ≠ 0.',
    answer: '', tags: ['exit-status', 'operadores']
  },
  {
    id: 'g010', moduleId: 'm02', type: 'comando', difficulty: 'intermedio',
    title: 'Redirección a /dev/null',
    body: '`/dev/null` es un "agujero negro": descarta todo lo que se le escribe.\n\n`comando > /dev/null` → descarta solo **stdout**.\n`comando 2> /dev/null` → descarta solo **stderr** (los errores).\n`comando &> /dev/null` → descarta **ambos** a la vez.\n`comando > /dev/null 2>&1` → equivalente clásico a `&>`.\n\n```\n$ cat /etc/host 2> /dev/null    # error silenciado, no se ve nada\n$ cat /etc/hosts 2> /dev/null   # existe -> se muestra normal\n```',
    answer: '', tags: ['redireccion', 'dev-null']
  },
  {
    id: 'g011', moduleId: 'm02', type: 'ejemplo', difficulty: 'avanzado',
    title: 'Caso práctico: Wireshark en segundo plano y silenciado',
    body: '```\n$ wireshark &> /dev/null & disown\n```\n\n- `&> /dev/null` → silencia los mensajes de captura.\n- `&` (al final) → envía el proceso a segundo plano, devolviendo el control a la terminal.\n- `disown` → lo desvincula del proceso padre (la shell). Así, si cierras la terminal, Wireshark **sigue ejecutándose** en vez de recibir SIGHUP y cerrarse.',
    answer: '', tags: ['procesos', 'background', 'disown']
  },
  {
    id: 'g012', moduleId: 'm02', type: 'comando', difficulty: 'intermedio',
    title: 'Procesos en segundo plano: comandos relacionados',
    body: '`comando &` → lanza el proceso en segundo plano.\n`jobs` → lista los procesos en segundo plano de la sesión.\n`fg %1` → trae el trabajo nº 1 a primer plano.\n`disown` → desvincula un proceso en background (sobrevive al cierre de la terminal).\n`nohup comando &` → alternativa a disown: ignora SIGHUP desde el inicio.',
    answer: '', tags: ['procesos', 'jobs', 'background']
  },
  {
    id: 'g013', moduleId: 'm02', type: 'teoria', difficulty: 'avanzado',
    title: 'Descriptores de archivo: definición',
    body: 'Un **descriptor de archivo** (file descriptor, FD) es un número entero no negativo que el sistema asigna a un proceso para referirse a un recurso abierto (archivo, socket, tubería, dispositivo...). Es un "índice" hacia una entrada en la tabla de archivos abiertos del kernel.\n\nLos tres reservados: 0 (stdin), 1 (stdout), 2 (stderr). A partir del 3 puedes crear los tuyos.',
    answer: '', tags: ['descriptores', 'conceptos']
  },
  {
    id: 'g014', moduleId: 'm02', type: 'comando', difficulty: 'avanzado',
    title: 'Crear, escribir y cerrar un descriptor con exec',
    body: '```\n$ exec 3<> file    # crea el descriptor 3 sobre "file"\n```\n`<` solo lectura · `>` solo escritura · `<>` ambas.\n\n```\n$ whoami >&3       # escribe la salida en el descriptor 3\n$ cat file\nkali\n\n$ exec 3>&-        # cierra el descriptor 3\n```\nAl cerrarlo, el contenido del archivo permanece, pero escribir de nuevo en `>&3` da error `bad file descriptor`.',
    answer: '', tags: ['descriptores', 'exec']
  },
  {
    id: 'g015', moduleId: 'm02', type: 'teoria', difficulty: 'avanzado',
    title: 'Duplicar (copiar) un descriptor',
    body: '```\n$ whoami >&5      # el descriptor 5 apunta a "data"\n$ exec 8>&5       # el 8 es una copia del 5\n$ who -q >&8       # escribe en 8... y por tanto en "data"\n```\n\n`exec 8>&5` no crea un archivo nuevo: hace que el descriptor 8 apunte a la **misma entrada de archivo abierto** que el 5. Como dos mandos para el mismo televisor. Si cierras uno y sigues usando el otro, la escritura sigue funcionando, porque la copia mantiene su propia referencia al recurso.',
    answer: '', tags: ['descriptores', 'exec']
  },

  /* ================================================================
     MÓDULO 3 — Permisos y notación octal
     ================================================================ */
  {
    id: 'g016', moduleId: 'm03', type: 'teoria', difficulty: 'basico',
    title: 'Filosofía del modelo de permisos',
    body: 'Linux es **multiusuario**: el sistema de permisos asegura que cada usuario solo acceda a lo suyo. Cada archivo o directorio tiene:\n\n1. Un **propietario** (owner/user).\n2. Un **grupo propietario**.\n3. Permisos para tres categorías: propietario, grupo y otros.',
    answer: '', tags: ['permisos', 'conceptos']
  },
  {
    id: 'g017', moduleId: 'm03', type: 'comando', difficulty: 'basico',
    title: 'Crear contenido y el peligro de > vs >>',
    body: '```\n$ touch file.txt              # crea un archivo vacío\n$ echo "Hola" > file.txt      # SOBRESCRIBE el contenido\n$ echo "Adios" >> file.txt     # AÑADE una línea al final\n```\n\n**Error común:** `>` siempre trunca (borra) el contenido previo; `>>` añade sin tocar lo existente. Es una causa frecuente de pérdida accidental de datos.',
    answer: '', tags: ['redireccion', 'peligro']
  },
  {
    id: 'g018', moduleId: 'm03', type: 'teoria', difficulty: 'basico',
    title: 'Anatomía de ls -l y tipos de archivo',
    body: 'Ejemplo: `drwxr-xr-x kali kali 4.0 KB ... build`\n\nEl primer carácter indica el **tipo**:\n- `d` → directorio\n- `-` → archivo regular\n- `l` → enlace simbólico\n- `c` → dispositivo de carácter (ej. /dev/null)\n- `b` → dispositivo de bloque\n\nLuego vienen 9 letras de permiso (3 grupos) y el propietario y grupo.',
    answer: '', tags: ['ls', 'permisos']
  },
  {
    id: 'g019', moduleId: 'm03', type: 'teoria', difficulty: 'basico',
    title: 'Las letras de permiso (rwx)',
    body: 'Se repiten 3 veces (propietario, grupo, otros):\n\n- **r** (read): leer contenido / listar un directorio.\n- **w** (write): modificar-borrar / crear-borrar archivos dentro.\n- **x** (execute): ejecutar programa / **atravesar** un directorio.\n- **-** : ausencia de permiso.',
    answer: '', tags: ['permisos', 'rwx']
  },
  {
    id: 'g020', moduleId: 'm03', type: 'tip', difficulty: 'intermedio',
    title: 'Distinción clave: x en un directorio (muy preguntada)',
    body: 'En un **directorio**, el permiso `x` no significa "ejecutar el directorio", sino **poder atravesarlo** para acceder a lo que contiene. Sin `x`, aunque tengas `r` (puedas listar los nombres), no podrás acceder al contenido de esos archivos ni hacer `cd` dentro.',
    answer: '', tags: ['permisos', 'directorios', 'examen']
  },
  {
    id: 'g021', moduleId: 'm03', type: 'comando', difficulty: 'intermedio',
    title: 'chmod en modo simbólico',
    body: 'Sintaxis: `chmod [ugoa][+-=][rwx] archivo`\n\n```\n$ chmod o+w prueba     # añade escritura a "otros"\n$ chmod g+w prueba     # añade escritura al grupo\n$ chmod u-x,g-rx,o+w prueba   # varios cambios con comas\n```\n\n- `u` user · `g` group · `o` others · `a` all\n- `+` añade · `-` quita · `=` establece exactamente (borra el resto).',
    answer: '', tags: ['chmod', 'permisos']
  },
  {
    id: 'g022', moduleId: 'm03', type: 'teoria', difficulty: 'intermedio',
    title: 'Notación octal: fundamento',
    body: 'Cada permiso es un bit, y cada grupo de 3 se lee como un dígito octal (0–7):\n\n- **r = 4**, **w = 2**, **x = 1**, **- = 0**\n\n**Fórmula:** valor = 4×(¿r?) + 2×(¿w?) + 1×(¿x?)\n\nEjemplo `chmod 542 testing` → `r-x r-- -w-`:\n- Propietario: 4+0+1 = 5\n- Grupo: 4+0+0 = 4\n- Otros: 0+2+0 = 2',
    answer: '', tags: ['octal', 'chmod']
  },
  {
    id: 'g023', moduleId: 'm03', type: 'tip', difficulty: 'intermedio',
    title: 'Combinaciones octales típicas del mundo real',
    body: '- **644** (`rw-r--r--`) → archivos normales: el dueño edita, el resto lee.\n- **755** (`rwxr-xr-x`) → scripts y directorios: el dueño controla, el resto lee/ejecuta/entra.\n- **600** (`rw-------`) → archivos sensibles (claves SSH): solo el dueño.\n- **777** (`rwxrwxrwx`) → **evitar**: todos pueden todo. Riesgo de seguridad.',
    answer: '', tags: ['octal', 'buenas-practicas']
  },

  /* ================================================================
     MÓDULO 4 — Usuarios y grupos
     ================================================================ */
  {
    id: 'g024', moduleId: 'm04', type: 'comando', difficulty: 'intermedio',
    title: 'chgrp y chown: cambiar grupo y propietario',
    body: '```\n$ chgrp kali prueba          # cambia solo el GRUPO propietario\n$ chown rami prueba          # cambia solo el PROPIETARIO\n$ chown rami:rami prueba     # cambia propietario Y grupo a la vez\n```\n\n**Nota:** cambiar el propietario (`chown`) normalmente requiere **root**, para que nadie pueda "regalar" archivos maliciosos a otros usuarios.',
    answer: '', tags: ['chown', 'chgrp', 'usuarios']
  },
  {
    id: 'g025', moduleId: 'm04', type: 'comando', difficulty: 'intermedio',
    title: 'useradd: crear usuarios',
    body: '```\n$ useradd rami -s /bin/bash -d /home/rami\n```\n- `-s` → shell de login asignada.\n- `-d` → ruta del directorio home.\n- `-m` → (recomendable) crea el home si no existe.\n- `-G` → grupos secundarios iniciales.',
    answer: '', tags: ['useradd', 'usuarios']
  },
  {
    id: 'g026', moduleId: 'm04', type: 'error', difficulty: 'intermedio',
    title: 'Error: useradd sin -m no crea el home',
    body: '`useradd` (sin `-m`) **no crea automáticamente** el directorio home ni copia los archivos de `/etc/skel`. Por eso, al hacer `su rami` y luego `cd`, aparece `No such file or directory`: el home fue declarado en `/etc/passwd` pero nunca se creó físicamente. La herramienta `adduser` (Debian) sí lo automatiza.',
    answer: '', tags: ['useradd', 'peligro']
  },
  {
    id: 'g027', moduleId: 'm04', type: 'comando', difficulty: 'intermedio',
    title: 'passwd, groupadd y usermod',
    body: '```\n$ passwd rami                    # asigna contraseña (cifrada en /etc/shadow)\n$ groupadd Alumnos               # crea un grupo\n$ usermod -a -G Alumnos rami     # añade rami al grupo Alumnos\n```\n- `-a` → append: añade sin tocar los grupos ya asignados.\n- `-G` → lista de grupos suplementarios.',
    answer: '', tags: ['passwd', 'groupadd', 'usermod']
  },
  {
    id: 'g028', moduleId: 'm04', type: 'error', difficulty: 'avanzado',
    title: 'El error de examen más frecuente: usermod -G sin -a',
    body: 'Ejecutar `usermod -G Alumnos rami` **sin** el flag `-a` no añade el grupo: **reemplaza completamente** la lista de grupos secundarios del usuario por únicamente `Alumnos`. Esto puede eliminar al usuario de grupos importantes (como `sudo` o `wheel`), dejándolo sin privilegios.\n\n**Regla: nunca uses `-G` sin `-a`** a menos que quieras sustituir TODOS los grupos.',
    answer: '', tags: ['usermod', 'peligro', 'examen']
  },

  /* ================================================================
     MÓDULO 5 — Permisos especiales y atributos
     ================================================================ */
  {
    id: 'g029', moduleId: 'm05', type: 'teoria', difficulty: 'avanzado',
    title: 'Sticky Bit',
    body: 'Permiso especial para **directorios**: aunque un usuario tenga escritura sobre el directorio, solo podrá borrar/renombrar los archivos de los que **él mismo es propietario** (o root).\n\n```\n$ chmod +t pruebaspepito\n$ ls -l\ndrwxrwxrwt ... pruebaspepito\n```\nLa `t` final indica el sticky bit. **Ejemplo real:** `/tmp` es escribible por todos, pero el sticky bit evita que un usuario borre los archivos temporales de otro.\n\nEn octal: cuarto dígito por delante con valor **1** → `chmod 1777 carpeta`.',
    answer: '', tags: ['sticky-bit', 'permisos-especiales']
  },
  {
    id: 'g030', moduleId: 'm05', type: 'teoria', difficulty: 'avanzado',
    title: 'SUID (Set User ID)',
    body: 'Aplicado a un **ejecutable**, hace que al ejecutarlo el proceso corra con los privilegios del **propietario del archivo**, no del usuario que lo lanza.\n\n```\n$ chmod u+s python3.13\n$ ls -l /usr/bin/python3.13\n-rwsr-xr-x 1 root root ... python3.13\n```\nLa `s` (en lugar de la `x` del propietario) indica SUID activo.\n\nBuscar binarios SUID: `find / -type f -perm -4000 2>/dev/null`\nEn octal, el dígito extra del SUID es **4**.',
    answer: '', tags: ['suid', 'permisos-especiales']
  },
  {
    id: 'g031', moduleId: 'm05', type: 'error', difficulty: 'avanzado',
    title: 'Riesgo: escalada de privilegios vía SUID',
    body: 'Si un binario SUID pertenece a **root** y permite ejecutar código arbitrario (ej. un intérprete como Python), cualquier usuario puede obtener root:\n\n```\n$ python3.13\n>>> import os\n>>> os.setuid(0)\n>>> os.system("whoami")\nroot\n```\n\nSUID afecta solo al **UID efectivo**, no a los grupos. Es la base de muchas técnicas documentadas en **GTFOBins**.',
    answer: '', tags: ['suid', 'seguridad', 'escalada']
  },
  {
    id: 'g032', moduleId: 'm05', type: 'teoria', difficulty: 'avanzado',
    title: 'SGID (Set Group ID)',
    body: 'Análogo al SUID pero para el **grupo**: el proceso adquiere los privilegios del **grupo propietario** del archivo. Aplicado a un **directorio**, todo archivo nuevo hereda automáticamente el grupo del directorio (útil para trabajo colaborativo).\n\n```\n$ chmod g+s python3.13\n-rwsr-sr-x ... python3.13\n```\nLa `s` aparece en la posición del grupo. En octal, el dígito extra es **2**. Buscar: `find / -perm -2000`.',
    answer: '', tags: ['sgid', 'permisos-especiales']
  },
  {
    id: 'g033', moduleId: 'm05', type: 'teoria', difficulty: 'intermedio',
    title: 'Tabla resumen: SUID / SGID / Sticky Bit',
    body: '| Bit | Se aplica a | Efecto | Símbolo | Octal |\n|---|---|---|---|---|\n| SUID | ejecutables | proceso con UID del propietario | `s` (dueño) | 4 |\n| SGID | ejecutables/dirs | proceso con GID del grupo / herencia de grupo | `s` (grupo) | 2 |\n| Sticky | directorios | solo el dueño borra sus archivos | `t` (otros) | 1 |',
    answer: '', tags: ['suid', 'sgid', 'sticky-bit', 'resumen']
  },
  {
    id: 'g034', moduleId: 'm05', type: 'comando', difficulty: 'avanzado',
    title: 'Atributos extendidos: chattr y lsattr',
    body: 'Operan a nivel del sistema de archivos, **independientes** de rwx, y pueden anular incluso a root.\n\n```\n$ lsattr                  # listar atributos\n$ chattr +i -V prueba     # +i = inmutable (ni root puede modificar/borrar)\n$ chattr -i -V prueba     # quitar el atributo\n```\n- `+i` inmutable · `-V` verbose · `+a` append-only (solo añadir, útil para logs).\n\nÚtil para proteger archivos de configuración o auditoría: incluso con root, hay que quitar el atributo primero (fricción + rastro).',
    answer: '', tags: ['chattr', 'lsattr', 'atributos']
  },
  {
    id: 'g035', moduleId: 'm05', type: 'comando', difficulty: 'intermedio',
    title: 'xargs: convertir salida en argumentos',
    body: 'Muchos comandos (como `ls`) esperan argumentos en la línea de comandos, no por tubería. `xargs` toma la salida de un comando y la convierte en argumentos del siguiente.\n\n```\n$ which python | xargs ls -l\nlrwxrwxrwx ... /usr/bin/python -> python3\n```\nAquí `which python` da una ruta, y `xargs ls -l` ejecuta `ls -l /usr/bin/python`.',
    answer: '', tags: ['xargs', 'pipes']
  },

  /* ================================================================
     MÓDULO 6 — Capabilities
     ================================================================ */
  {
    id: 'g036', moduleId: 'm06', type: 'teoria', difficulty: 'avanzado',
    title: 'Qué son las capabilities',
    body: 'Mecanismo del kernel que **divide los privilegios de root en unidades independientes** otorgables por separado. En vez de "root puede todo / usuario no puede nada", una capability concede a un binario **un privilegio concreto** (ej. abrir puertos privilegiados) sin darle root completo.\n\nReduce la superficie de ataque frente a SUID, aunque algunas capabilities son tan peligrosas como SUID-root.',
    answer: '', tags: ['capabilities', 'conceptos']
  },
  {
    id: 'g037', moduleId: 'm06', type: 'comando', difficulty: 'avanzado',
    title: 'getcap: ver capabilities',
    body: '```\n$ getcap -r / 2> /dev/null\n/usr/bin/fping cap_net_raw=ep\n/usr/lib/nmap/nmap cap_net_bind_service,cap_net_admin,cap_net_raw=eip\n```\n- `-r` → búsqueda recursiva desde la raíz.\n- Notación `=ep`/`=eip`: e = effective (activa), p = permitted, i = inheritable.',
    answer: '', tags: ['getcap', 'capabilities']
  },
  {
    id: 'g038', moduleId: 'm06', type: 'error', difficulty: 'avanzado',
    title: 'Capability crítica: cap_setuid',
    body: '`cap_setuid` permite a un proceso cambiar su propio UID (como `os.setuid()`). Si un binario como Python la tiene activa, cualquier usuario puede convertirse en root, igual que con SUID:\n\n```\n$ getcap -r / 2>/dev/null\n/usr/bin/python3.13 cap_setuid=ep\n```\nEl mecanismo es idéntico al ejemplo de SUID: `os.setuid(0)` + `os.system("whoami")` devolvería root.',
    answer: '', tags: ['capabilities', 'seguridad', 'escalada']
  },
  {
    id: 'g039', moduleId: 'm06', type: 'comando', difficulty: 'avanzado',
    title: 'setcap: añadir y quitar capabilities',
    body: '```\n$ setcap cap_setuid+ep /usr/bin/python3.13   # añadir\n$ getcap /usr/bin/python3.13\n/usr/bin/python3.13 cap_setuid=ep\n\n$ setcap -r /usr/bin/python3.13              # quitar (todas)\n```\nEl atajo `!$` reutiliza el último argumento del comando anterior.',
    answer: '', tags: ['setcap', 'capabilities']
  },
  {
    id: 'g040', moduleId: 'm06', type: 'teoria', difficulty: 'intermedio',
    title: 'Comparación: SUID vs SGID vs Sticky vs Capabilities',
    body: '| Mecanismo | Granularidad | Riesgo |\n|---|---|---|\n| SUID | Todo o nada (UID del dueño) | Muy alto si dueño = root |\n| SGID | Todo o nada (GID del grupo) | Alto |\n| Sticky Bit | No da privilegios, solo restringe | Ninguno (es defensivo) |\n| Capabilities | Granular (privilegio concreto) | Variable (`cap_setuid` ≈ SUID-root; `cap_net_bind_service` mucho menor) |',
    answer: '', tags: ['comparacion', 'resumen']
  },

  /* ================================================================
     MÓDULO 7 — Estructura de directorios (FHS)
     ================================================================ */
  {
    id: 'g041', moduleId: 'm07', type: 'teoria', difficulty: 'basico',
    title: 'El estándar FHS y sus dos ejes',
    body: 'La estructura de directorios sigue el **Filesystem Hierarchy Standard (FHS)**. Clasifica cada directorio según dos ejes:\n\n- **Estático vs variable:** estático = no cambia salvo intervención del admin (binarios); variable = cambia con el uso normal (logs, temporales).\n- **Compartible vs no compartible:** compartible = puede residir en un servidor de red; no compartible = depende de la máquina concreta.',
    answer: '', tags: ['fhs', 'directorios']
  },
  {
    id: 'g042', moduleId: 'm07', type: 'teoria', difficulty: 'basico',
    title: 'Directorios principales (tabla)',
    body: '- `/` raíz · `/bin` binarios esenciales · `/sbin` binarios solo-root\n- `/boot` arranque (kernel, GRUB) · `/dev` dispositivos como archivos\n- `/etc` configuración · `/home` archivos de usuarios · `/root` home de root\n- `/lib` bibliotecas compartidas · `/mnt` y `/media` puntos de montaje\n- `/opt` programas de terceros · `/proc` y `/sys` info virtual del kernel\n- `/tmp` temporales (sticky bit) · `/var` datos variables (logs)\n- `/usr` mayoría de programas (solo lectura) · `/srv` datos de servidores\n- `/lost+found` archivos recuperados tras `fsck`',
    answer: '', tags: ['fhs', 'directorios']
  },
  {
    id: 'g043', moduleId: 'm07', type: 'tip', difficulty: 'intermedio',
    title: 'Cómo usar el FHS al investigar un sistema',
    body: 'Esta clasificación te dice **dónde mirar primero**:\n- Credenciales y configuración → `/etc`\n- Actividad reciente y errores → `/var/log`\n- Programas de terceros potencialmente vulnerables → `/opt`\n- Procesos en ejecución en tiempo real → `/proc`',
    answer: '', tags: ['fhs', 'seguridad']
  },

  /* ================================================================
     MÓDULO 8 — Shell: personalización y texto
     ================================================================ */
  {
    id: 'g044', moduleId: 'm08', type: 'teoria', difficulty: 'basico',
    title: 'Archivos ocultos y .bashrc / .zshrc',
    body: 'Los **archivos ocultos** son los que empiezan por punto (`.`); `ls` sin `-a` los omite. Entre ellos, `.bashrc` y `.zshrc` son scripts que la shell ejecuta automáticamente al abrir cada terminal interactiva. Ahí se definen alias, variables de entorno y funciones.\n\n```\n$ ls -a    # muestra también los ocultos\n```',
    answer: '', tags: ['bashrc', 'zshrc', 'ocultos']
  },
  {
    id: 'g045', moduleId: 'm08', type: 'comando', difficulty: 'intermedio',
    title: 'Extraer campos de texto: awk y cut',
    body: '```\n$ hostname -I | awk \'{print $1}\'    # primer campo (separa por espacios)\n10.0.2.15\n\n$ hostname -I | cut -d \' \' -f 1      # equivalente con cut\n10.0.2.15\n```\n- `cut -d` → define el delimitador · `-f` → número de campo.\n- `awk` es más flexible (condiciones, cálculos); `cut` es más directo para separadores fijos.',
    answer: '', tags: ['awk', 'cut', 'texto']
  },
  {
    id: 'g046', moduleId: 'm08', type: 'teoria', difficulty: 'intermedio',
    title: 'Sustitución de comandos: $(...)',
    body: 'Ejecuta un comando y sustituye su salida dentro de una cadena de texto:\n\n```\n$ echo "Tu IP es: $(hostname -I | awk \'{print $1}\')"\nTu IP es: 10.0.2.15\n```\n\nEquivale a las comillas invertidas antiguas, pero `$()` es más legible y se puede anidar.',
    answer: '', tags: ['sustitucion', 'comandos']
  },
  {
    id: 'g047', moduleId: 'm08', type: 'ejemplo', difficulty: 'intermedio',
    title: 'Funciones personalizadas en .zshrc',
    body: '```\nfunction vermiip(){\n    echo "Tu IP privada es: $(hostname -I | awk \'{print $1}\')"\n}\n```\nTras guardar y recargar (`source ~/.zshrc` o abrir terminal nueva):\n\n```\n$ vermiip\nTu IP privada es: 10.0.2.15\n```\nÚtil para automatizar comandos que repites a menudo.',
    answer: '', tags: ['funciones', 'zshrc']
  },

  /* ================================================================
     MÓDULO 9 — Gestión de paquetes (APT)
     ================================================================ */
  {
    id: 'g048', moduleId: 'm09', type: 'comando', difficulty: 'basico',
    title: 'apt update: actualizar el índice',
    body: '```\n$ sudo apt update\n```\n**No instala ni actualiza nada.** Solo descarga la información más reciente sobre qué versiones existen en los repositorios. Es el paso previo obligatorio antes de `apt upgrade`.\n\n```\n$ apt list --upgradable    # ver qué se puede actualizar\n```',
    answer: '', tags: ['apt', 'paquetes']
  },
  {
    id: 'g049', moduleId: 'm09', type: 'error', difficulty: 'basico',
    title: 'Diferencia clave: apt update vs apt upgrade',
    body: 'Error conceptual muy común:\n- **`apt update`** → actualiza la **lista** de qué versiones existen (no toca programas).\n- **`apt upgrade`** → instala **de verdad** las versiones nuevas, usando esa lista.\n\nEjecutar `upgrade` sin `update` antes puede no aplicar todas las actualizaciones, porque trabaja con información obsoleta. Ambos requieren `sudo`.',
    answer: '', tags: ['apt', 'update', 'upgrade', 'examen']
  },

  /* ================================================================
     MÓDULO 10 — Tmux y Kitty
     ================================================================ */
  {
    id: 'g050', moduleId: 'm10', type: 'teoria', difficulty: 'intermedio',
    title: 'Tmux: multiplexor de terminales',
    body: '**Tmux** permite crear varias ventanas/paneles en una única sesión, y que esa sesión **siga corriendo en segundo plano** aunque cierres la terminal o pierdas la conexión SSH. Al reconectar, retomas donde lo dejaste.\n\nConecta con `disown`: mientras disown desvincula un proceso, tmux desvincula una **sesión completa** con todos sus procesos.',
    answer: '', tags: ['tmux', 'conceptos']
  },
  {
    id: 'g051', moduleId: 'm10', type: 'comando', difficulty: 'intermedio',
    title: 'Tmux: crear, atajos y recuperar sesiones',
    body: '```\n$ tmux new -s Sergio         # crea sesión con nombre\n$ tmux ls                     # lista sesiones activas\n$ tmux attach -t Sergio       # recupera una sesión concreta\n```\nAtajos (tras el prefijo **Ctrl+b**):\n- `,` renombrar ventana · `c` nueva ventana · `0-9` cambiar de ventana\n- `"` dividir horizontal · `%` dividir vertical · `o` alternar paneles\n- `$` renombrar sesión · `d` desvincular (detach)',
    answer: '', tags: ['tmux', 'atajos']
  },
  {
    id: 'g052', moduleId: 'm10', type: 'teoria', difficulty: 'intermedio',
    title: 'Kitty vs tmux: diferencia clave',
    body: '**Kitty** es un emulador de terminal (gestiona ventanas visuales). **Tmux** gestiona sesiones de shell persistentes, independientes de la app gráfica.\n\nDiferencia práctica: si cierras Kitty por completo, **todas sus ventanas mueren**. Pero una sesión de tmux (aunque se abriera dentro de Kitty) **sigue viva** y se recupera con `tmux attach`. Por eso se combinan: Kitty organiza la pantalla, tmux da persistencia.',
    answer: '', tags: ['kitty', 'tmux', 'comparacion']
  },
  {
    id: 'g053', moduleId: 'm10', type: 'comando', difficulty: 'intermedio',
    title: 'Kitty: atajos principales',
    body: 'Casi todos comparten el prefijo **Ctrl+Shift**:\n- `Ctrl+Shift+Alt+T` → nueva ventana\n- `Ctrl+Shift+Enter` → nueva terminal (en la ventana actual)\n- `Ctrl+Shift+T` → nueva pestaña\n- `Ctrl+Shift+W` → cerrar terminal\n- `Ctrl+Shift + flecha` → moverse entre terminales\n- `Ctrl+Shift+R` → cambiar tamaño\n- `Ctrl+Alt + arrastrar` → selección rectangular (por columnas)',
    answer: '', tags: ['kitty', 'atajos']
  },

  /* ================================================================
     MÓDULO 11 — Búsquedas con find
     ================================================================ */
  {
    id: 'g054', moduleId: 'm11', type: 'comando', difficulty: 'basico',
    title: 'find: búsqueda por nombre',
    body: '```\n$ find / -name passwd 2> /dev/null\n/etc/passwd\n/usr/bin/passwd\n...\n```\nBusca cualquier archivo/directorio llamado exactamente `passwd` en todo el sistema. El `2> /dev/null` descarta los errores de "permiso denegado".',
    answer: '', tags: ['find', 'busqueda']
  },
  {
    id: 'g055', moduleId: 'm11', type: 'ejemplo', difficulty: 'intermedio',
    title: 'find + xargs, y por qué passwd tiene SUID',
    body: '```\n$ find / -name passwd 2>/dev/null | xargs ls -l\n-rwsr-xr-x 1 root root ... /usr/bin/passwd\n```\n\n`/usr/bin/passwd` tiene **SUID** por diseño legítimo: un usuario normal no puede escribir en `/etc/shadow`, pero necesita cambiar su contraseña. SUID le permite escribir ahí momentáneamente como root, y nada más. Ejemplo canónico de SUID necesario.',
    answer: '', tags: ['find', 'xargs', 'suid']
  },
  {
    id: 'g056', moduleId: 'm11', type: 'comando', difficulty: 'intermedio',
    title: 'find: filtrar por permisos, grupo, usuario y tipo',
    body: '```\n$ find / -perm -4000 2>/dev/null       # binarios SUID (al menos)\n$ find / -group kali 2>/dev/null        # por grupo propietario\n$ find / -group kali -type d 2>/dev/null # solo directorios del grupo\n$ find / -user root -writable 2>/dev/null # archivos de root que TÚ puedes escribir\n```\n`-type f` archivos · `-type d` directorios · `-type l` enlaces.',
    answer: '', tags: ['find', 'perm', 'filtros']
  },
  {
    id: 'g057', moduleId: 'm11', type: 'tip', difficulty: 'avanzado',
    title: '-writable no es lo mismo que el bit w',
    body: '`-perm` compara los bits de permiso tal como están escritos. `-writable` (y `-readable`, `-executable`) comprueban si **el usuario que ejecuta find tendría realmente** permiso, considerando su usuario/grupo y el estado del sistema. Es una comprobación de **acceso real**, útil en auditorías para hallar rutas de escalada (archivos de root que un usuario sin privilegios puede modificar).',
    answer: '', tags: ['find', 'writable', 'seguridad']
  },
  {
    id: 'g058', moduleId: 'm11', type: 'tip', difficulty: 'intermedio',
    title: 'Comodines en find: por qué escaparlos',
    body: '```\n$ find / -name \\*exdum\\* 2>/dev/null\n```\nLos `*` significan "cualquier cosa antes y después de exdum". Hay que escaparlos (`\\*` o comillas `"*exdum*"`) porque si no, la **shell** intenta expandirlos antes de que `find` los reciba. Las dos formas son equivalentes: consiguen que sea `find`, no la shell, quien interprete el comodín.',
    answer: '', tags: ['find', 'comodines', 'shell']
  },
  {
    id: 'g059', moduleId: 'm11', type: 'comando', difficulty: 'intermedio',
    title: 'find: tabla de referencia rápida',
    body: '- `-name "patrón"` → nombre (con comodines protegidos)\n- `-type f` / `-type d` → archivo / directorio\n- `-perm -4000` → al menos SUID · `-perm 4000` → coincidencia exacta\n- `-group nombre` / `-user nombre` → grupo / usuario propietario\n- `-writable` / `-readable` / `-executable` → acceso real\n- `-size +10M` / `-size -10M` → mayor / menor que un tamaño\n- `-mtime -1` / `-mtime +7` → modificado hace menos / más de N días\n- `-exec comando {} \\;` → ejecuta un comando sobre cada resultado',
    answer: '', tags: ['find', 'referencia']
  },
  {
    id: 'g060', moduleId: 'm11', type: 'ejercicio', difficulty: 'intermedio',
    title: 'Borrar archivos .txt con find -exec',
    body: 'Objetivo: crear 3 archivos `.txt` de prueba y borrarlos todos con un único comando `find` usando `-exec` (sin `rm *`).\n\nConceptos: `-name`, comodines protegidos, `-exec ... {} \\;`.',
    answer: '```\n$ touch p1.txt p2.txt p3.txt\n$ find . -name "*.txt" -exec rm {} \\;\n```\n\n- `"*.txt"` → patrón con comodín, entre comillas para que lo interprete find.\n- `{}` → marcador que find sustituye por cada archivo encontrado.\n- `\\;` → barra invertida + punto y coma, marca el final del comando `-exec` (escapado para que la shell no lo trate como un `;` normal).',
    tags: ['find', 'exec', 'ejercicio']
  },
  {
    id: 'g061', moduleId: 'm11', type: 'teoria', difficulty: 'basico',
    title: 'find vs locate: velocidad y actualidad',
    body: '**find** recorre el sistema de archivos en tiempo real → siempre da el estado actual, pero es más lento.\n\n**locate** consulta una **base de datos indexada** (generada por `updatedb`, normalmente vía cron una vez al día) → muchísimo más rápido, pero puede dar resultados desactualizados (archivos creados/borrados tras el último `updatedb`).\n\nUsa `find` cuando necesitas certeza del estado actual; `locate` para localizar algo rápido.',
    answer: '', tags: ['find', 'locate', 'comparacion']
  },

  /* ================================================================
     MÓDULO 12 — Scripting en Bash
     ================================================================ */
  {
    id: 'g062', moduleId: 'm12', type: 'comando', difficulty: 'basico',
    title: 'Crear y ejecutar un script + permiso de ejecución',
    body: '```\n$ nvim mi_script.sh      # crear/editar\n$ ./mi_script.sh          # ejecutar\n```\n\n**Requisito:** el archivo necesita permiso `x`. Si al crearlo no lo tiene:\n```\n$ chmod +x mi_script.sh\n```\nSin esto, obtienes `permission denied` al ejecutar con `./`.',
    answer: '', tags: ['bash', 'scripting', 'chmod']
  },
  {
    id: 'g063', moduleId: 'm12', type: 'teoria', difficulty: 'basico',
    title: 'El shebang #!/bin/bash',
    body: 'Todo script debería empezar con:\n```\n#!/bin/bash\n```\nLe dice al sistema **qué intérprete usar** para ejecutar el archivo, sin importar la shell que uses tú. Aunque tu shell interactiva sea `zsh`, el script correrá con `bash` gracias a esta línea. Importante porque la sintaxis no es 100% intercambiable entre shells.',
    answer: '', tags: ['bash', 'shebang']
  },
  {
    id: 'g064', moduleId: 'm12', type: 'comando', difficulty: 'intermedio',
    title: 'Extraer líneas: tail y awk NR==N',
    body: '```\n$ ip a | grep eth0 | tail -n 1      # ÚLTIMA línea\n$ ip a | grep eth0 | awk \'NR==2\'      # línea número 2\n```\n`NR` (Number of Records) es el número de línea actual en awk. `tail -n 1` coge siempre la última (sin importar cuántas haya); `NR==2` apunta a una posición fija.',
    answer: '', tags: ['bash', 'tail', 'awk']
  },
  {
    id: 'g065', moduleId: 'm12', type: 'ejemplo', difficulty: 'avanzado',
    title: 'Script completo: mostrar la IP privada',
    body: '```\n#!/bin/bash\necho -e "\\nTu IP privada es -> $(ip a | grep eth0 | tail -n 1 | awk \'{print $2}\' | awk \'{print $1}\' FS="/")\\n"\n```\nDe dentro hacia fuera:\n- `awk \'{print $2}\'` → extrae la IP con máscara (10.0.2.15/24).\n- `awk \'{print $1}\' FS="/"` → segundo awk con separador `/`, se queda con la IP sin la máscara.\n- `$(...)` → sustitución de comandos.\n- `echo -e "\\n...\\n"` → `-e` interpreta `\\n` como salto de línea real.',
    answer: '', tags: ['bash', 'awk', 'FS', 'ejemplo']
  },
  {
    id: 'g066', moduleId: 'm12', type: 'tip', difficulty: 'intermedio',
    title: 'FS en awk como alternativa a un segundo cut',
    body: '`awk` permite cambiar su separador de campos (`FS`, Field Separator) en cada llamada. En vez de encadenar `cut -d "/" -f 1`, puedes usar `awk \'{print $1}\' FS="/"` y lograr lo mismo dentro del propio awk. Ambos enfoques son válidos; es cuestión de preferencia.',
    answer: '', tags: ['awk', 'FS', 'cut']
  },

  /* ================================================================
     MÓDULO 13 — Vim
     ================================================================ */
  {
    id: 'g067', moduleId: 'm13', type: 'teoria', difficulty: 'basico',
    title: 'Los dos modos de Vim',
    body: 'Vim (y `nvim`) funciona por **modos**:\n- **Modo normal** (por defecto): las teclas son **comandos** (moverse, borrar, copiar), no texto.\n- **Modo inserción**: las teclas se escriben como texto normal.\n\nSe entra en inserción con `i` y se vuelve a normal con `Esc`.',
    answer: '', tags: ['vim', 'modos']
  },
  {
    id: 'g068', moduleId: 'm13', type: 'error', difficulty: 'basico',
    title: 'Error típico: escribir sin pulsar i',
    body: 'Si intentas escribir en Vim sin pulsar `i` primero, **no se inserta texto** — cada tecla se interpreta como un comando del modo normal (algunos borran o mueven cosas). Es la causa más común de scripts que salen vacíos o alterados al empezar con Vim.',
    answer: '', tags: ['vim', 'peligro']
  },
  {
    id: 'g069', moduleId: 'm13', type: 'comando', difficulty: 'intermedio',
    title: 'Navegación, borrado y copia en modo normal',
    body: 'Navegación:\n- `0` → inicio de línea · `$` → fin de línea\n- `w` → avanza una palabra · `[n]w` → avanza n palabras\n\nEdición:\n- `dd` → borra la línea completa\n- `y` → copiar (yank) · `p` → pegar\n- `u` → deshacer (tecla estándar, sin modificador) · `Ctrl+r` → rehacer',
    answer: '', tags: ['vim', 'navegacion', 'edicion']
  },
  {
    id: 'g070', moduleId: 'm13', type: 'comando', difficulty: 'intermedio',
    title: 'Buscar y sustituir en Vim',
    body: 'Búsqueda (modo normal): tecla `/`, escribe el patrón, Enter. `n` siguiente, `N` anterior.\n\nSustitución global:\n```\n:%s/nologin/yeslogin/g\n```\n- `:` modo comando · `%` todo el archivo · `s` substitute\n- `/patrón/reemplazo/` · `g` todas las coincidencias por línea\n\nSin `g` solo cambia la primera de cada línea; sin `%` solo la línea actual.',
    answer: '', tags: ['vim', 'sustitucion', 'regex']
  },
  {
    id: 'g071', moduleId: 'm13', type: 'comando', difficulty: 'basico',
    title: 'Comandos esenciales de Vim (resumen)',
    body: '- `i` insertar · `Esc` modo normal\n- `0` / `$` inicio / fin de línea\n- `w` / `[n]w` avanzar palabra(s)\n- `dd` borrar línea · `y` / `p` copiar / pegar\n- `u` deshacer · `Ctrl+r` rehacer\n- `/patrón` buscar · `:%s/a/b/g` sustituir en todo el archivo\n- `:wq` guardar y salir · `:q!` salir sin guardar',
    answer: '', tags: ['vim', 'resumen']
  },

  /* ================================================================
     MÓDULO 14 — Repaso: preguntas de examen
     ================================================================ */
  {
    id: 'q01', moduleId: 'm14', type: 'pregunta', difficulty: 'basico',
    title: 'Diferencia entre 2> /dev/null y &> /dev/null',
    body: '¿Qué diferencia hay entre `comando 2> /dev/null` y `comando &> /dev/null`?',
    answer: '`2> /dev/null` descarta únicamente stderr (los errores), mostrando stdout con normalidad. `&> /dev/null` descarta tanto stdout como stderr, silenciando toda la salida del comando.',
    tags: ['redireccion', 'examen']
  },
  {
    id: 'q02', moduleId: 'm14', type: 'pregunta', difficulty: 'basico',
    title: 'Convierte rwxr-x--- a octal',
    body: 'Convierte los permisos `rwxr-x---` a notación octal.',
    answer: 'Propietario rwx = 4+2+1 = 7; grupo r-x = 4+0+1 = 5; otros --- = 0. Resultado: **750**.',
    tags: ['octal', 'examen']
  },
  {
    id: 'q03', moduleId: 'm14', type: 'pregunta', difficulty: 'intermedio',
    title: 'usermod -G sin -a estando en el grupo sudo',
    body: '¿Qué ocurre si ejecutas `usermod -G Ventas carlos` sin el flag `-a`, y carlos ya pertenecía al grupo sudo?',
    answer: 'El usuario carlos **pierde su pertenencia al grupo sudo**, porque `-G` sin `-a` reemplaza por completo la lista de grupos secundarios en lugar de añadir uno nuevo. Quedaría únicamente en el grupo Ventas.',
    tags: ['usermod', 'examen']
  },
  {
    id: 'q04', moduleId: 'm14', type: 'pregunta', difficulty: 'intermedio',
    title: 'Un archivo -rwsr-xr-x de root',
    body: 'Un archivo tiene permisos `-rwsr-xr-x` y pertenece a root. ¿Qué implica en términos de seguridad?',
    answer: 'La `s` en la posición de ejecución del propietario indica que el bit SUID está activo. Como el propietario es root, cualquier usuario que lo ejecute lanzará el proceso con privilegios de root, lo cual es un riesgo de escalada si el binario permite ejecutar comandos arbitrarios (ej. un intérprete como Python o Perl).',
    tags: ['suid', 'examen']
  },
  {
    id: 'q05', moduleId: 'm14', type: 'pregunta', difficulty: 'intermedio',
    title: '¿Por qué el sticky bit en /tmp?',
    body: '¿Por qué es necesario el sticky bit en un directorio como /tmp, si ya existen permisos rwx normales?',
    answer: 'Porque /tmp necesita ser escribible por todos (para que cualquiera cree archivos temporales), pero sin el sticky bit, cualquier usuario con escritura sobre el directorio podría borrar o renombrar archivos de otros. El sticky bit restringe esa operación exclusivamente al propietario del archivo (o root).',
    tags: ['sticky-bit', 'examen']
  },
  {
    id: 'q06', moduleId: 'm14', type: 'pregunta', difficulty: 'intermedio',
    title: 'Localizar binarios SGID',
    body: '¿Qué comando usarías para localizar todos los binarios con el bit SGID activado en el sistema?',
    answer: '`find / -type f -perm -2000 2>/dev/null` (análogo al `-perm -4000` de SUID, pero con el valor octal 2000 correspondiente a SGID).',
    tags: ['sgid', 'find', 'examen']
  },
  {
    id: 'q07', moduleId: 'm14', type: 'pregunta', difficulty: 'avanzado',
    title: 'SUID vs cap_setuid',
    body: 'Explica la diferencia entre SUID y una capability como cap_setuid en términos de riesgo de seguridad.',
    answer: 'Ambos pueden llevar al mismo resultado (cambiar el UID efectivo a 0), por lo que en la práctica cap_setuid es tan peligrosa como el SUID sobre un binario de root. La diferencia conceptual es que las capabilities permiten, en otros casos, conceder privilegios mucho más acotados (como cap_net_bind_service, que solo abre puertos privilegiados), mientras que SUID es una concesión "todo o nada" del UID completo del propietario.',
    tags: ['suid', 'capabilities', 'examen']
  },
  {
    id: 'q08', moduleId: 'm14', type: 'pregunta', difficulty: 'avanzado',
    title: 'Error al escribir en un descriptor cerrado',
    body: '¿Qué mensaje de error obtendrías al intentar escribir en un descriptor de archivo cerrado con `exec 3>&-`, y por qué?',
    answer: 'Un error tipo `bad file descriptor`, porque el descriptor 3 ya no está asociado a ningún archivo abierto tras cerrarse; la shell no tiene ningún canal válido al que dirigir esa escritura.',
    tags: ['descriptores', 'examen']
  },
  {
    id: 'q09', moduleId: 'm14', type: 'pregunta', difficulty: 'avanzado',
    title: '¿Puede root borrar un archivo con chattr +i?',
    body: 'Si `chattr +i archivo.txt` está activo, ¿puede el usuario root borrar ese archivo directamente con `rm`?',
    answer: 'No. El atributo inmutable (+i) impide la modificación o borrado del archivo incluso para root, hasta que alguien con privilegios ejecute explícitamente `chattr -i archivo.txt` para desactivar el atributo primero.',
    tags: ['chattr', 'examen']
  },
  {
    id: 'q10', moduleId: 'm14', type: 'pregunta', difficulty: 'intermedio',
    title: 'apt update antes de apt upgrade',
    body: '¿Por qué hay que ejecutar apt update antes de apt upgrade, y qué podría pasar si no lo haces?',
    answer: 'apt update refresca la lista local de qué versiones existen en los repositorios; apt upgrade instala las nuevas versiones basándose en esa lista. Si no ejecutas update antes, upgrade trabaja con información potencialmente obsoleta y puede no detectar actualizaciones recientes disponibles.',
    tags: ['apt', 'examen']
  },
  {
    id: 'q11', moduleId: 'm14', type: 'pregunta', difficulty: 'intermedio',
    title: 'tmux attach vs tmux attach -t nombre',
    body: '¿Qué diferencia hay entre `tmux attach` y `tmux attach -t nombre_sesion`?',
    answer: '`tmux attach` reengancha la sesión desvinculada más reciente (o la única existente). `tmux attach -t nombre_sesion` reengancha específicamente la sesión indicada por nombre, necesario cuando hay varias sesiones activas y no quieres depender del orden.',
    tags: ['tmux', 'examen']
  },
  {
    id: 'q12', moduleId: 'm14', type: 'pregunta', difficulty: 'avanzado',
    title: '¿Por qué /usr/bin/passwd tiene SUID?',
    body: '¿Por qué /usr/bin/passwd tiene el bit SUID activo, y por qué no se considera un fallo de seguridad?',
    answer: 'Un usuario normal no tiene escritura sobre /etc/shadow (contraseñas cifradas), pero necesita cambiar su propia contraseña. El SUID permite que el proceso corra momentáneamente como root para escribir en /etc/shadow, exclusivamente para esa tarea concreta — un uso legítimo y necesario de SUID, distinto de los binarios mal configurados que sí son un riesgo.',
    tags: ['suid', 'passwd', 'examen']
  },
];

/* La app lee estas constantes globales. No cambiar los nombres. */
window.STUDY_MODULES = STUDY_MODULES;
window.STUDY_NOTES = STUDY_NOTES;

/* Versión de la guía. SÚBELA (p. ej. a 2, 3, ...) cada vez que se
   añadan apuntes nuevos: así la app detecta que hay contenido más
   reciente y ofrece incorporarlo sin perder tu progreso. */
window.STUDY_DATA_VERSION = 1;
