import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Brain, CheckCircle2, ChevronRight, Crown, Flame, Heart, HelpCircle, RotateCcw, ScrollText, Shield, Sparkles, Star, Trophy, Wand2, XCircle } from "lucide-react";

const LS_KEY = "toraQuestLeaderboardV2";

const categories = [
  { id: "bereshit", label: "Bereshit", hebrew: "בראשית", icon: Sparkles, gradient: "from-amber-300 via-orange-400 to-rose-500", description: "Creación y los comienzos del pueblo de Israel" },
  { id: "shemot", label: "Shemot", hebrew: "שמות", icon: Flame, gradient: "from-sky-300 via-blue-500 to-indigo-800", description: "Egipto, Moshe Rabenu, las plagas y Matan Torá" },
  { id: "vayikra", label: "Vayikrá", hebrew: "ויקרא", icon: Crown, gradient: "from-violet-300 via-purple-500 to-fuchsia-800", description: "Kedushá, korbanot, Cohanim y pureza" },
  { id: "bamidbar", label: "Bamidbar", hebrew: "במדבר", icon: Shield, gradient: "from-emerald-300 via-teal-500 to-cyan-800", description: "El desierto, el campamento y liderazgo" },
  { id: "devarim", label: "Devarim", hebrew: "דברים", icon: BookOpen, gradient: "from-yellow-200 via-amber-400 to-yellow-700", description: "El discurso final de Moshe" },
  { id: "personajes", label: "Personajes", hebrew: "דמויות", icon: Heart, gradient: "from-pink-300 via-red-500 to-orange-700", description: "Los grandes personajes de la Torá" },
];

const ALL_QUESTIONS = [
  // BERESHIT nivel 1
  { category:"bereshit",level:1,question:"¿Qué creó Hashem en el primer día?",options:["La luz","Los peces","El sol y la luna","El ser humano"],answer:"La luz",hint:"Antes de los astros ya había una separación fundamental.",note:"La Torá relata la creación de la luz antes que los astros." },
  { category:"bereshit",level:1,question:"¿Cómo se llamaba el hijo de Avraham y Sara?",options:["Yishmael","Itzjak","Yacob","Yosef"],answer:"Itzjak",hint:"Su nombre se relaciona con la risa.",note:"Itzjak nace como cumplimiento de la promesa divina." },
  { category:"bereshit",level:1,question:"¿Qué vendió Esav a Yacob?",options:["Su bendición","Su primogenitura","Su rebaño","Su tienda"],answer:"Su primogenitura",hint:"Era un derecho ligado al nacimiento.",note:"Esav entrega la primogenitura a cambio de comida." },
  { category:"bereshit",level:1,question:"¿Quién fue salvado del diluvio con su familia?",options:["Noaj","Teraj","Lavan","Yehudá"],answer:"Noaj",hint:"Construyó una tevah.",note:"Noaj preservó a su familia y a los animales." },
  { category:"bereshit",level:1,question:"¿Cuántos días duró la creación del mundo?",options:["5 días","6 días","7 días","10 días"],answer:"6 días",hint:"El séptimo Hashem descansó.",note:"Hashem creó el mundo en seis días y el séptimo fue Shabat." },
  { category:"bereshit",level:1,question:"¿Cómo se llamaban los primeros seres humanos?",options:["Adam y Javá","Noaj y Naama","Avraham y Sara","Yacob y Rajel"],answer:"Adam y Javá",hint:"Vivieron en el jardín.",note:"Adam fue creado del polvo y Javá de su costilla." },
  { category:"bereshit",level:1,question:"¿En qué jardín vivieron Adam y Javá?",options:["Gan Eden","Har Sinai","Beer Sheva","Goshen"],answer:"Gan Eden",hint:"Era un paraíso.",note:"El Gan Eden es el jardín del Edén." },
  { category:"bereshit",level:1,question:"¿Quién mató a Hevel?",options:["Kayin","Noaj","Lemej","Shet"],answer:"Kayin",hint:"Era su hermano mayor.",note:"Kayin mató a Hevel por celos ante la aceptación de su ofrenda." },
  { category:"bereshit",level:1,question:"¿De qué tierra salió Avram cuando Hashem le pidió que partiera?",options:["Ur Kasdim","Mitzraim","Canaan","Bavel"],answer:"Ur Kasdim",hint:"Era la tierra de su padre.",note:"Hashem le dice a Avram 'lej lejá' desde Ur Kasdim." },
  { category:"bereshit",level:1,question:"¿Cuántos hijos tuvo Yacob Avinu?",options:["10 hijos","11 hijos","12 hijos","13 hijos"],answer:"12 hijos",hint:"Forman las tribus de Israel.",note:"Los 12 hijos de Yacob son los antepasados de las 12 tribus." },
  // BERESHIT nivel 2
  { category:"bereshit",level:2,question:"¿Cuál fue el sueño de Yacob al salir de Beer Sheva?",options:["Una escalera hacia el cielo","Siete vacas flacas","Una zarza ardiente","Una nube sobre el Mishkán"],answer:"Una escalera hacia el cielo",hint:"Había malajim subiendo y bajando.",note:"Yacob ve una escalera cuya cima llega al cielo." },
  { category:"bereshit",level:2,question:"¿Qué señal del pacto aparece después del diluvio?",options:["El arco iris","La Menorá","El shofar","La paloma"],answer:"El arco iris",hint:"Aparece en el cielo después de la lluvia.",note:"El arco iris es la señal del pacto tras el diluvio." },
  { category:"bereshit",level:2,question:"¿Qué nombre recibió Yacob después de luchar con el ángel?",options:["Israel","Yehoshua","Efraim","Eliezer"],answer:"Israel",hint:"Ese nombre da identidad al pueblo entero.",note:"Yacob recibe el nombre Israel luego de ese episodio." },
  { category:"bereshit",level:2,question:"¿Cuántos años trabajó Yacob para casarse con Rajel?",options:["5 años","7 años","10 años","14 años"],answer:"14 años",hint:"Trabajó 7 por Leá y 7 por Rajel.",note:"Lavan engañó a Yacob dándole primero a Leá." },
  { category:"bereshit",level:2,question:"¿Quién fue la esposa de Itzjak?",options:["Rivká","Sara","Rajel","Leá"],answer:"Rivká",hint:"Vino de Aram Naharaim.",note:"Eliezer fue a buscar a Rivká para Itzjak." },
  { category:"bereshit",level:2,question:"¿Qué torre intentaron construir los hombres en Bereshit?",options:["Torre de Bavel","Torre de Canaan","Torre de Ur","Torre de Sinai"],answer:"Torre de Bavel",hint:"Querían llegar al cielo.",note:"Hashem confundió las lenguas y dispersó al pueblo." },
  { category:"bereshit",level:2,question:"¿Qué prueba vivió Avraham con su hijo Itzjak en Har Moriá?",options:["La Akedá","El diluvio","La salida de Ur","La guerra de los reyes"],answer:"La Akedá",hint:"Se la conoce como 'la atadura'.",note:"La Akedá es la máxima prueba de fe de Avraham." },
  { category:"bereshit",level:2,question:"¿Quién fue la primera esposa de Yacob?",options:["Leá","Rajel","Bilhá","Zilpá"],answer:"Leá",hint:"Lavan la dio primero engañando a Yacob.",note:"Lavan engañó a Yacob en la noche de la boda." },
  // BERESHIT nivel 3
  { category:"bereshit",level:3,question:"¿Cuántos años tenía Avraham cuando nació Itzjak?",options:["70 años","80 años","99 años","100 años"],answer:"100 años",hint:"Sara tenía 90.",note:"Avraham tenía 100 años cuando nació Itzjak." },
  { category:"bereshit",level:3,question:"¿Qué significa el nombre 'Yosef'?",options:["Hashem añadirá","Hashem salva","Hijo de la derecha","El que lucha"],answer:"Hashem añadirá",hint:"Rajel expresó su esperanza al nombrarlo.",note:"Rajel dijo 'Hashem añadirá otro hijo' al nombrarlo Yosef." },
  { category:"bereshit",level:3,question:"¿Qué hizo Yosef con la copa de plata de Biniamin?",options:["La escondió en su bolsa","Se la regaló","La vendió","La tiró al río"],answer:"La escondió en su bolsa",hint:"Fue una prueba para sus hermanos.",note:"Yosef puso la copa en la bolsa de Biniamin para probar a sus hermanos." },
  { category:"bereshit",level:3,question:"¿Cuántos años vivió Noaj?",options:["500 años","750 años","950 años","120 años"],answer:"950 años",hint:"Fue de los más longevos.",note:"Noaj vivió 950 años según la Torá." },
  { category:"bereshit",level:3,question:"¿Cuál es la primera palabra de la Torá?",options:["Bereshit","Shemot","Vayikrá","Devarim"],answer:"Bereshit",hint:"Da nombre al primer libro.",note:"Bereshit significa 'en el principio'." },
  // SHEMOT nivel 1
  { category:"shemot",level:1,question:"¿Quién fue elegido para sacar a Israel de Egipto?",options:["Aharon","Yehoshua","Moshe","Yehudá"],answer:"Moshe",hint:"Fue criado en la casa de Paró.",note:"Moshe Rabenu recibe la misión en la zarza ardiente." },
  { category:"shemot",level:1,question:"¿Quién acompañó a Moshe como portavoz ante Paró?",options:["Aharon","Calev","Yosef","Noaj"],answer:"Aharon",hint:"Era su hermano.",note:"Aharon actúa como portavoz de Moshe ante Paró." },
  { category:"shemot",level:1,question:"¿Qué ocurrió en Yam Suf?",options:["Se abrió el mar","Cayó el man","Se construyó el Mishkán","Nació Itzjak"],answer:"Se abrió el mar",hint:"Fue el gran cruce de la salida de Egipto.",note:"El cruce de Yam Suf es uno de los momentos centrales del Éxodo." },
  { category:"shemot",level:1,question:"¿Dónde recibió Israel la Torá?",options:["Har Sinai","Beer Sheva","Chevron","Goshen"],answer:"Har Sinai",hint:"Es el monte asociado a Matan Torá.",note:"La entrega de la Torá ocurre en Har Sinai." },
  { category:"shemot",level:1,question:"¿Cuántas plagas envió Hashem a Egipto?",options:["7 plagas","8 plagas","10 plagas","12 plagas"],answer:"10 plagas",hint:"Se recuerdan en el Séder de Pesaj.",note:"Las 10 plagas culminan con la muerte de los primogénitos." },
  { category:"shemot",level:1,question:"¿Qué fiesta conmemora la salida de Egipto?",options:["Pesaj","Sucot","Shavuot","Rosh Hashaná"],answer:"Pesaj",hint:"Incluye el Séder y la Hagadá.",note:"Pesaj celebra la liberación de la esclavitud en Egipto." },
  { category:"shemot",level:1,question:"¿En qué objeto se manifestó Hashem ante Moshe?",options:["Una zarza ardiente","Una nube","Una paloma","Un arco iris"],answer:"Una zarza ardiente",hint:"Ardía pero no se consumía.",note:"La zarza ardiente es la primera revelación de Hashem a Moshe." },
  // SHEMOT nivel 2
  { category:"shemot",level:2,question:"¿Qué marcó la sangre en los dinteles antes de la salida?",options:["Las casas de Israel","Los palacios de Egipto","El campamento de Amalek","El camino al mar"],answer:"Las casas de Israel",hint:"Era señal para la última plaga.",note:"La señal distinguía las casas de Israel en la noche de la última plaga." },
  { category:"shemot",level:2,question:"¿Qué objeto contenía las Lujot?",options:["El Aron","La Menorá","El Shulján","El Mizbeaj"],answer:"El Aron",hint:"Era el arca en el espacio más sagrado.",note:"El Aron HaKodesh contenía las Lujot del pacto." },
  { category:"shemot",level:2,question:"¿Cuál fue la primera plaga de Egipto?",options:["La sangre","Las ranas","Los piojos","Las langostas"],answer:"La sangre",hint:"El río Nilo se convirtió en esto.",note:"El agua del Nilo se convirtió en sangre." },
  { category:"shemot",level:2,question:"¿Cuánto tiempo estuvo Moshe en el monte Sinai?",options:["20 días","30 días","40 días","50 días"],answer:"40 días",hint:"El número 40 aparece mucho en la Torá.",note:"Moshe estuvo 40 días y 40 noches en el monte." },
  { category:"shemot",level:2,question:"¿Qué pecado cometió el pueblo mientras Moshe estaba en el monte?",options:["El egel hazahav","La queja del man","La rebelión de Koraj","El episodio de Baal Peor"],answer:"El egel hazahav",hint:"Era un ídolo de metal.",note:"El pueblo hizo un becerro de oro mientras esperaba a Moshe." },
  { category:"shemot",level:2,question:"¿Quién salvó a Moshe bebé poniéndolo en una canasta?",options:["Su madre Yojeved","Su hermana Miriam","La hija de Paró","Su abuela"],answer:"Su madre Yojeved",hint:"Lo ocultó durante tres meses.",note:"Yojeved puso a Moshe en una canasta de juncos para salvarlo." },
  { category:"shemot",level:2,question:"¿Cuál fue la última plaga de Egipto?",options:["La muerte de los primogénitos","Las langostas","La oscuridad","El granizo"],answer:"La muerte de los primogénitos",hint:"Convenció a Paró de dejar ir al pueblo.",note:"Esta plaga finalmente quebró la resistencia de Paró." },
  // SHEMOT nivel 3
  { category:"shemot",level:3,question:"¿Cómo se llama el nombre de Hashem revelado a Moshe?",options:["Ehié Asher Ehié","Elohim","Adonai","El Shadai"],answer:"Ehié Asher Ehié",hint:"Significa 'Seré lo que seré'.",note:"Este nombre expresa la eternidad y presencia de Hashem." },
  { category:"shemot",level:3,question:"¿Qué tribu fue designada para el servicio del Mishkán?",options:["Leví","Yehudá","Efraim","Dan"],answer:"Leví",hint:"No recibió porción de tierra en Israel.",note:"Los levitas se dedicaron al servicio sagrado en lugar de la guerra." },
  { category:"shemot",level:3,question:"¿Qué material NO se usó en la construcción del Mishkán?",options:["Hierro","Oro","Plata","Cobre"],answer:"Hierro",hint:"El hierro se asocia con la guerra.",note:"El Mishkán fue construido con oro, plata, cobre y materiales naturales." },
  { category:"shemot",level:3,question:"¿Cuántas piezas principales tenía el Mishkán?",options:["5","7","9","12"],answer:"9",hint:"Entre ellas la Menorá, el Shulján y el Aron.",note:"El Mishkán tenía un conjunto de keilim sagrados con funciones específicas." },
  // VAYIKRA nivel 1
  { category:"vayikra",level:1,question:"¿Quiénes tenían función especial en el servicio del Mishkán?",options:["Los Cohanim","Los comerciantes","Los espías","Los egipcios"],answer:"Los Cohanim",hint:"Aharon y sus descendientes.",note:"Los Cohanim fueron designados para el servicio sagrado." },
  { category:"vayikra",level:1,question:"¿Qué significa kedushá?",options:["Santidad para un propósito elevado","Comercio justo","Viaje sagrado","Victoria en guerra"],answer:"Santidad para un propósito elevado",hint:"No es solo apartarse; es orientarse hacia algo superior.",note:"Kedushá implica elevar la vida cotidiana hacia un propósito sagrado." },
  { category:"vayikra",level:1,question:"¿Qué día aparece en Vayikrá como día de expiación?",options:["Yom Kipur","Purim","Janucá","Tu Bishvat"],answer:"Yom Kipur",hint:"Es el día central de kapará y teshuvá.",note:"Yom Kipur ocupa un lugar central en el servicio de Vayikrá." },
  { category:"vayikra",level:1,question:"¿Qué animales terrestres son kasher?",options:["Los que rumian y tienen pezuña partida","Todos los animales veloces","Solo los animales blancos","Los que viven cerca del agua"],answer:"Los que rumian y tienen pezuña partida",hint:"Son dos señales juntas.",note:"La Torá da señales específicas para animales terrestres kasher." },
  // VAYIKRA nivel 2
  { category:"vayikra",level:2,question:"¿Qué precepto resume la ética con el prójimo en Kedoshim?",options:["Amar al prójimo como a uno mismo","Comprar la primogenitura","Construir una tevah","Contar las estrellas"],answer:"Amar al prójimo como a uno mismo",hint:"Es una de las frases éticas más conocidas de la Torá.",note:"Kedoshim contiene un núcleo ético fundamental." },
  { category:"vayikra",level:2,question:"¿Qué es el año de Shemitá?",options:["El séptimo año en que la tierra descansa","El año del Yovel","El año de la cosecha doble","El año de la construcción del Templo"],answer:"El séptimo año en que la tierra descansa",hint:"La tierra 'descansa' como el Shabat.",note:"En Shemitá la tierra de Israel queda sin cultivar." },
  { category:"vayikra",level:2,question:"¿Cuántos hijos de Aharon murieron al ofrecer fuego extraño?",options:["1 hijo","2 hijos","3 hijos","4 hijos"],answer:"2 hijos",hint:"Eran los mayores.",note:"Nadav y Avihú murieron por ofrecer un fuego no ordenado." },
  { category:"vayikra",level:2,question:"¿Qué se llama Yovel?",options:["El año 50 de liberación","El séptimo año","El año de la primera cosecha","El primer Shabat"],answer:"El año 50 de liberación",hint:"Viene después de 7 ciclos de Shemitá.",note:"En el Yovel los esclavos son liberados y las tierras vuelven a sus dueños." },
  // VAYIKRA nivel 3
  { category:"vayikra",level:3,question:"¿Qué significa el término 'korban'?",options:["Acercamiento a Hashem","Sacrificio animal obligatorio","Oración matutina","Purificación ritual"],answer:"Acercamiento a Hashem",hint:"La raíz es 'karov', cercano.",note:"Un korban es un medio de acercamiento y conexión con lo divino." },
  { category:"vayikra",level:3,question:"¿Qué parashá contiene las leyes de kashrut?",options:["Sheminí","Kedoshim","Emor","Behar"],answer:"Sheminí",hint:"Es la octava parashá de Vayikrá.",note:"Sheminí incluye las leyes sobre animales puros e impuros." },
  { category:"vayikra",level:3,question:"¿Con qué se asocia la tzaraat según los jajamim?",options:["Con el lashon hará","Con la idolatría","Con el robo","Con la pereza"],answer:"Con el lashon hará",hint:"Es el pecado del habla.",note:"La tzaraat es diagnosticada por el Cohen y tiene un proceso de purificación." },
  // BAMIDBAR nivel 1
  { category:"bamidbar",level:1,question:"¿Qué alimento cayó del cielo en el desierto?",options:["Man","Dátiles","Trigo","Aceitunas"],answer:"Man",hint:"Aparecía cada día, salvo Shabat.",note:"El man sostenía al pueblo durante su marcha por el desierto." },
  { category:"bamidbar",level:1,question:"¿Qué señal guiaba al campamento durante el día?",options:["Una nube","Una estrella","Un río","Una columna de oro"],answer:"Una nube",hint:"De noche había fuego.",note:"La nube indicaba cuándo acampar y cuándo avanzar." },
  { category:"bamidbar",level:1,question:"¿Quién sucedió a Moshe como líder del pueblo?",options:["Yehoshua","Aharon","Pinjás","Calev"],answer:"Yehoshua",hint:"Fue uno de los espías fieles.",note:"Yehoshua bin Nun fue designado para conducir al pueblo." },
  { category:"bamidbar",level:1,question:"¿Cuántos espías envió Moshe a reconocer Eretz Israel?",options:["10 espías","11 espías","12 espías","13 espías"],answer:"12 espías",hint:"Uno por cada tribu.",note:"Moshe envió un príncipe de cada tribu como espía." },
  // BAMIDBAR nivel 2
  { category:"bamidbar",level:2,question:"¿Quiénes fueron los dos espías que dieron informe positivo?",options:["Yehoshua y Calev","Moshe y Aharon","Yacob y Esav","Nadav y Avihú"],answer:"Yehoshua y Calev",hint:"Uno sucedería a Moshe como líder.",note:"Solo ellos mantuvieron la confianza en la conquista." },
  { category:"bamidbar",level:2,question:"¿Quién se rebeló contra el liderazgo de Moshe y Aharon?",options:["Koraj","Betzalel","Efrón","Teraj"],answer:"Koraj",hint:"Su nombre identifica una parashá.",note:"Koraj encabeza una rebelión y la tierra lo traga." },
  { category:"bamidbar",level:2,question:"¿Cuántos años duró la travesía por el desierto?",options:["20 años","30 años","40 años","50 años"],answer:"40 años",hint:"El número 40 es muy significativo en la Torá.",note:"La generación del desierto caminó 40 años." },
  { category:"bamidbar",level:2,question:"¿Qué rey de Moav contrató a Bilam para maldecir a Israel?",options:["Balak","Og","Sijón","Arad"],answer:"Balak",hint:"La parashá lleva su nombre.",note:"Balak ben Tzipor contrató al profeta Bilam." },
  { category:"bamidbar",level:2,question:"¿Qué animal habló con Bilam en el camino?",options:["Su burra","Un águila","Un buey","Un camello"],answer:"Su burra",hint:"El animal vio al ángel antes que Bilam.",note:"La burra de Bilam habló cuando vio al ángel de Hashem." },
  // BAMIDBAR nivel 3
  { category:"bamidbar",level:3,question:"¿Qué significa 'Bamidbar'?",options:["En el desierto","En las palabras","En el principio","En el éxodo"],answer:"En el desierto",hint:"Es el ambiente central del libro.",note:"Bamidbar significa 'en el desierto', donde transcurre la narrativa." },
  { category:"bamidbar",level:3,question:"¿Qué hizo Pinjás que detuvo una plaga?",options:["Mató a un israelita y una madianita","Oró 40 días","Construyó un altar","Cruzó el Jordán"],answer:"Mató a un israelita y una madianita",hint:"Actuó con celo por Hashem.",note:"Pinjás actuó con zeluté y recibió el pacto de la paz." },
  { category:"bamidbar",level:3,question:"¿Cuál era la función de las ciudades de refugio?",options:["Proteger al homicida involuntario","Guardar el tesoro del Mishkán","Albergar a los Cohanim","Servir de prisión"],answer:"Proteger al homicida involuntario",hint:"Existían 6 en total.",note:"Las arei miklat protegían al que mató sin intención." },
  // DEVARIM nivel 1
  { category:"devarim",level:1,question:"¿Quién pronuncia los discursos de Sefer Devarim?",options:["Moshe","Yosef","Noaj","Paró"],answer:"Moshe",hint:"Son sus palabras antes de entrar a la Tierra.",note:"Devarim reúne el discurso final de Moshe al pueblo." },
  { category:"devarim",level:1,question:"¿Qué texto central comienza con 'Shemá Israel'?",options:["Shemá","Birkat Hamazón","Aleinu","Avinu Malkeinu"],answer:"Shemá",hint:"Es una declaración central de emuná.",note:"El Shemá ocupa un lugar esencial en la vida judía." },
  { category:"devarim",level:1,question:"¿Qué mitzvá se relaciona con los postes de la casa?",options:["Mezuzá","Shofar","Lulav","Tzitzit"],answer:"Mezuzá",hint:"Se coloca en la puerta.",note:"La mezuzá contiene parshiot escritas por un sofer." },
  { category:"devarim",level:1,question:"¿Dónde murió Moshe Rabenu?",options:["Har Nebo","Har Sinai","Har Moriá","Har Karmel"],answer:"Har Nebo",hint:"Desde allí vio la Tierra de Israel.",note:"Moshe murió en Har Nebo sin entrar a la Tierra Prometida." },
  // DEVARIM nivel 2
  { category:"devarim",level:2,question:"¿Qué debe hacer el pueblo con la memoria de la salida de Egipto?",options:["Recordarla y transmitirla","Ocultarla","Venderla","Olvidarla"],answer:"Recordarla y transmitirla",hint:"La memoria es una obligación educativa.",note:"La Torá insiste en recordar y transmitir el Éxodo." },
  { category:"devarim",level:2,question:"¿Cuántas mitzvot contiene la Torá según la tradición?",options:["248","365","613","1000"],answer:"613",hint:"248 positivas y 365 negativas.",note:"Las 613 mitzvot son la base del sistema legal judío." },
  { category:"devarim",level:2,question:"¿Qué significa 'Devarim'?",options:["Las palabras","Los números","Los nombres","Las leyes"],answer:"Las palabras",hint:"El libro comienza con 'estas son las palabras'.",note:"Devarim es el libro de las palabras de Moshe." },
  { category:"devarim",level:2,question:"¿Qué canta Moshe antes de morir?",options:["El Shirat Haazinu","El Shemá","El Halel","El Shir Hamaalot"],answer:"El Shirat Haazinu",hint:"Es un poema en forma de canción.",note:"Haazinu es el canto-poema que Moshe entrega como testimonio." },
  // DEVARIM nivel 3
  { category:"devarim",level:3,question:"En Nitzavim, ¿ante quiénes se renueva el pacto?",options:["Ante todos, incluso generaciones futuras","Solo ante los Cohanim","Solo ante Paró","Solo ante los espías"],answer:"Ante todos, incluso generaciones futuras",hint:"Habla de los presentes y los que no están ese día.",note:"El pacto en Nitzavim incluye a todas las generaciones." },
  { category:"devarim",level:3,question:"¿Cuál es la última parashá de la Torá?",options:["Vezot Habrajá","Nitzavim","Haazinu","Ki Tavó"],answer:"Vezot Habrajá",hint:"Se lee en Simjat Torá.",note:"Vezot Habrajá concluye la Torá con la muerte de Moshe." },
  { category:"devarim",level:3,question:"¿Qué característica distingue a Moshe de todos los profetas?",options:["Habló con Hashem cara a cara","Hizo más milagros","Vivió más años","Tenía más alumnos"],answer:"Habló con Hashem cara a cara",hint:"Panim el panim.",note:"La Torá dice que no hubo profeta como Moshe." },
  // PERSONAJES nivel 1
  { category:"personajes",level:1,question:"¿Quién fue el padre de Avraham?",options:["Teraj","Noaj","Yacob","Lavan"],answer:"Teraj",hint:"Aparece antes de la partida hacia Canaan.",note:"Teraj fue el padre de Avram." },
  { category:"personajes",level:1,question:"¿Cómo se llamaba la esposa que Yacob más amaba?",options:["Rajel","Leá","Rivká","Sara"],answer:"Rajel",hint:"Yacob trabajó 7 años por ella.",note:"Yacob trabajó por Rajel con Lavan." },
  { category:"personajes",level:1,question:"¿Quién interpretó los sueños de Paró en Egipto?",options:["Yosef","Moshe","Aharon","Betzalel"],answer:"Yosef",hint:"Había sido vendido por sus hermanos.",note:"Yosef interpretó los sueños de las vacas y las espigas." },
  { category:"personajes",level:1,question:"¿Quién era la hermana de Moshe y Aharon?",options:["Miriam","Rajel","Leá","Diná"],answer:"Miriam",hint:"Cantó después del cruce de Yam Suf.",note:"Miriam tuvo un rol fundamental desde la infancia de Moshe." },
  { category:"personajes",level:1,question:"¿Quién fue el primer Cohen Gadol?",options:["Aharon","Moshe","Yehoshua","Pinjás"],answer:"Aharon",hint:"Era hermano de Moshe.",note:"Aharon fue ungido como primer Cohen Gadol." },
  // PERSONAJES nivel 2
  { category:"personajes",level:2,question:"¿Quién fue llamado 'HaTzadik' por su conducta en Egipto?",options:["Yosef","Esav","Lavan","Koraj"],answer:"Yosef",hint:"Resistió una prueba moral muy grande.",note:"Yosef es recordado como Yosef HaTzadik." },
  { category:"personajes",level:2,question:"¿Quién fue el constructor principal del Mishkán?",options:["Betzalel","Yacob","Calev","Yishmael"],answer:"Betzalel",hint:"Su nombre se asocia a la sombra de Hashem.",note:"Betzalel recibió sabiduría artística para la obra del Mishkán." },
  { category:"personajes",level:2,question:"¿Quién fue el suegro de Moshe?",options:["Yitró","Lavan","Teraj","Amalek"],answer:"Yitró",hint:"Era sacerdote de Midián.",note:"Yitró fue sacerdote de Midián y suegro de Moshe." },
  { category:"personajes",level:2,question:"¿Por qué fue castigada Miriam con tzaraat?",options:["Habló mal de Moshe","Rompió las Lujot","Se rebeló contra Aharon","Adoró al egel"],answer:"Habló mal de Moshe",hint:"Es el ejemplo clásico de lashon hará.",note:"Miriam habló sobre el matrimonio de Moshe y fue castigada." },
  { category:"personajes",level:2,question:"¿Quién fue Kalev ben Yefuné?",options:["El espía que defendió Eretz Israel","El hijo de Moshe","El Cohen que bendijo al pueblo","El arquitecto del Mishkán"],answer:"El espía que defendió Eretz Israel",hint:"Junto con Yehoshua dio informe positivo.",note:"Calev fue uno de los dos espías fieles y heredó Jevrón." },
  // PERSONAJES nivel 3
  { category:"personajes",level:3,question:"¿Cuál era el nombre de la madre de Moshe?",options:["Yojeved","Miriam","Shifra","Puá"],answer:"Yojeved",hint:"Era de la tribu de Leví.",note:"Yojeved fue quien ocultó a Moshe y luego lo crió para Paró." },
  { category:"personajes",level:3,question:"¿Qué profetisa guió al pueblo junto a Moshe y Aharon?",options:["Miriam","Devora","Julda","Sara"],answer:"Miriam",hint:"Era la hermana de los dos líderes.",note:"Miriam es mencionada como profetisa que lideró a las mujeres." },
  { category:"personajes",level:3,question:"¿Quién ungió a Aharon como Cohen Gadol?",options:["Moshe","Yehoshua","Calev","Pinjás"],answer:"Moshe",hint:"Era su hermano mayor.",note:"Moshe realizó la unción de Aharon y sus hijos." },
];

const difficultyOptions = [
  { id: "talmid", label: "Talmid", subtitle: "Preguntas fáciles · 10 preguntas", count: 10, level: 1, icon: BookOpen },
  { id: "jajam", label: "Jajam", subtitle: "Fácil y media · 20 preguntas", count: 20, level: 2, icon: Brain },
  { id: "gaon", label: "Gaón", subtitle: "Todas las dificultades · 30 preguntas", count: 30, level: 3, icon: Crown },
];

const normalize = (v) => String(v || "").trim().toLowerCase();
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const getCategory = (id) => categories.find((c) => c.id === id) || categories[0];
const prepareQuestion = (q) => ({ ...q, options: shuffle(q.options) });

function loadScores() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveScore(entry) {
  const next = [...loadScores(), entry].sort((a, b) => b.score - a.score || b.percent - a.percent).slice(0, 5);
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next;
}

function CategoryBadge({ category }) {
  const Icon = category.icon;
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${category.gradient} px-3 py-1.5 text-xs font-black text-white shadow-xl`}>
      <Icon className="h-3 w-3" />{category.label} <span className="opacity-80">{category.hebrew}</span>
    </div>
  );
}

function ProgressRing({ score, answered }) {
  const pct = answered ? Math.round((score / answered) * 100) : 0;
  return (
    <div className="relative grid h-16 w-16 place-items-center rounded-full bg-white/10">
      <div className="absolute inset-1 rounded-full" style={{ background: `conic-gradient(rgba(255,255,255,.9) ${pct * 3.6}deg, rgba(255,255,255,.12) 0deg)` }} />
      <div className="absolute inset-3 rounded-full bg-slate-950/95" />
      <div className="relative text-sm font-black text-white">{pct}%</div>
    </div>
  );
}

function FancyButton({ children, className = "", ...props }) {
  return (
    <motion.button whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} className={`rounded-2xl px-4 py-3 font-black shadow-xl transition ${className}`} {...props}>
      {children}
    </motion.button>
  );
}

function StatBox({ label, value, tone = "text-amber-200" }) {
  return (
    <div className="rounded-2xl bg-white/10 p-2 text-center shadow-inner">
      <p className="text-[10px] uppercase tracking-widest text-white/50">{label}</p>
      <p className={`text-2xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

function DifficultyBadge({ level }) {
  const map = { 1: ["Fácil","text-emerald-300"], 2: ["Media","text-amber-300"], 3: ["Difícil","text-rose-300"] };
  const [label, color] = map[level] || map[1];
  return <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>;
}

function MenuScreen({ startGame, leaderboard }) {
  const [sel, setSel] = useState("jajam");
  const selected = difficultyOptions.find((d) => d.id === sel) || difficultyOptions[1];
  const easy = ALL_QUESTIONS.filter(q => q.level === 1).length;
  const med = ALL_QUESTIONS.filter(q => q.level === 2).length;
  const hard = ALL_QUESTIONS.filter(q => q.level === 3).length;

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
            <ScrollText className="h-3 w-3" /> Trivia de Torá
          </div>
          <h2 className="text-3xl font-black leading-tight">Respondé, aprendé y ganá coronas de sabiduría.</h2>
          <p className="mt-2 text-sm text-white/70">
            {ALL_QUESTIONS.length} preguntas · <span className="text-emerald-300">{easy} fáciles</span> · <span className="text-amber-300">{med} medias</span> · <span className="text-rose-300">{hard} difíciles</span>
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {difficultyOptions.map((d) => {
              const Icon = d.icon;
              const active = d.id === sel;
              return (
                <button key={d.id} onClick={() => setSel(d.id)} className={`rounded-2xl border p-3 text-left transition ${active ? "border-amber-200 bg-amber-300/20" : "border-white/15 bg-white/10"}`}>
                  <Icon className="mb-1 h-5 w-5 text-amber-200" />
                  <p className="text-sm font-black">{d.label}</p>
                  <p className="text-[10px] text-white/60">{d.subtitle}</p>
                </button>
              );
            })}
          </div>
          <FancyButton onClick={() => startGame(selected)} className="mt-4 w-full bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950">
            <span className="inline-flex items-center justify-center gap-2">Empezar partida <ChevronRight className="h-4 w-4" /></span>
          </FancyButton>
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-200" /><h3 className="font-black">Categorías</h3></div>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = ALL_QUESTIONS.filter(q => q.category === cat.id).length;
            return (
              <div key={cat.id} className={`flex items-center gap-2 rounded-2xl bg-gradient-to-br ${cat.gradient} p-3 opacity-90`}>
                <Icon className="h-4 w-4 text-white shrink-0" />
                <div><p className="text-xs font-black text-white">{cat.label}</p><p className="text-[10px] text-white/70">{count} preguntas</p></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2"><Trophy className="h-4 w-4 text-amber-200" /><h3 className="font-black">Ranking local</h3></div>
        {leaderboard.length ? (
          <div className="space-y-2">
            {leaderboard.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-950/40 px-3 py-2">
                <div><p className="text-sm font-black">#{idx+1} · {item.title}</p><p className="text-[10px] text-white/55">{item.difficulty} · racha {item.bestStreak}</p></div>
                <div className="text-right"><p className="text-xl font-black text-amber-200">{item.score}</p><p className="text-[10px] text-white/55">{item.percent}%</p></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-950/40 p-3 text-sm text-white/60">¡La primera corona te espera!</p>
        )}
      </section>
    </div>
  );
}

function GameScreen({ deck, meta, finishGame, restart }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [skipUsed, setSkipUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const current = deck[index];
  const category = getCategory(current.category);
  const Icon = category.icon;
  const progress = Math.round(((index + (answered ? 1 : 0)) / deck.length) * 100);

  const answer = (option) => {
    if (answered) return;
    const correct = normalize(option) === normalize(current.answer);
    setSelected(option); setAnswered(true);
    setHistory((prev) => [...prev, { category: current.category, correct }]);
    if (correct) { setScore((p) => p + 1); setStreak((p) => { const n = p+1; setBestStreak((o) => Math.max(o,n)); return n; }); }
    else { setStreak(0); }
  };

  const next = () => {
    if (index + 1 >= deck.length) { finishGame({ score, total: deck.length, percent: Math.round((score/deck.length)*100), bestStreak, history, difficulty: meta.label }); return; }
    setSpinning(true);
    setTimeout(() => { setIndex((p) => p+1); setSelected(null); setAnswered(false); setHintVisible(false); setHiddenOptions([]); setSpinning(false); }, 350);
  };

  const useHint = () => { if (hintUsed||answered) return; setHintUsed(true); setHintVisible(true); };
  const useFifty = () => {
    if (fiftyUsed||answered) return;
    const wrong = current.options.filter((o) => normalize(o) !== normalize(current.answer));
    setHiddenOptions(shuffle(wrong).slice(0,2)); setFiftyUsed(true);
  };
  const useSkip = () => {
    if (skipUsed||answered) return; setSkipUsed(true);
    if (index+1>=deck.length) { finishGame({ score, total: deck.length, percent: Math.round((score/deck.length)*100), bestStreak, history, difficulty: meta.label }); }
    else { setSpinning(true); setTimeout(() => { setIndex((p) => p+1); setHintVisible(false); setHiddenOptions([]); setSpinning(false); }, 300); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-3xl border border-white/15 bg-white/10 p-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <ProgressRing score={score} answered={history.length||1} />
          <div>
            <CategoryBadge category={category} />
            <div className="mt-1 flex items-center gap-2">
              <p className="text-[10px] text-white/55">{index+1}/{deck.length}</p>
              <DifficultyBadge level={current.level} />
            </div>
          </div>
        </div>
        <motion.div animate={spinning ? { rotate:360, scale:[1,1.1,1] } : { rotate:0 }} transition={{ duration:0.4 }} className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${category.gradient} shadow-xl`}>
          <Icon className="h-6 w-6" />
        </motion.div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-400" animate={{ width:`${progress}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Puntos" value={score} />
        <StatBox label="Racha" value={streak} tone="text-cyan-200" />
        <StatBox label="Mejor" value={bestStreak} tone="text-fuchsia-200" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity:0, y:20, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.2 }} className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/60 p-4 shadow-2xl">
          <h2 className="text-xl font-black leading-snug">{current.question}</h2>

          <AnimatePresence>
            {hintVisible && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="mt-3 rounded-2xl border border-amber-200/30 bg-amber-300/15 p-3 text-sm text-amber-50">
                <span className="font-black">Pista:</span> {current.hint}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {current.options.map((option, i) => {
              const isHidden = hiddenOptions.includes(option);
              const isCorrect = normalize(option) === normalize(current.answer);
              const isSelected = normalize(option) === normalize(selected);
              const showCorrect = answered && isCorrect;
              const showWrong = answered && isSelected && !isCorrect;
              return (
                <motion.button key={option} whileTap={!answered && !isHidden ? { scale:0.97 } : undefined} onClick={() => !isHidden && answer(option)} disabled={isHidden}
                  className={["relative min-h-[72px] overflow-hidden rounded-2xl border p-3 text-left text-sm font-bold shadow-lg transition-all",
                    isHidden ? "border-white/5 bg-white/5 opacity-20 cursor-default" : "",
                    showCorrect ? "border-emerald-300 bg-emerald-500/25" : "",
                    showWrong ? "border-rose-300 bg-rose-500/25" : "",
                    !showCorrect && !showWrong && !isHidden ? "border-white/15 bg-white/10 active:bg-white/20" : "",
                  ].join(" ")}>
                  <span className="text-[10px] font-black text-white/40 block mb-1">{String.fromCharCode(65+i)}</span>
                  {option}
                  {showCorrect && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-emerald-300" />}
                  {showWrong && <XCircle className="absolute right-2 top-2 h-4 w-4 text-rose-300" />}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[{label:"Pista",icon:HelpCircle,action:useHint,used:hintUsed},{label:"50/50",icon:Wand2,action:useFifty,used:fiftyUsed},{label:"Pasar",icon:ChevronRight,action:useSkip,used:skipUsed}].map(({label,icon:BtnIcon,action,used}) => (
              <button key={label} onClick={action} disabled={used||answered} className={`flex items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/10 py-2 text-xs font-black transition ${used||answered ? "opacity-30 cursor-default" : "active:bg-white/20"}`}>
                <BtnIcon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-3">
                <p className={`text-base font-black ${normalize(selected)===normalize(current.answer) ? "text-emerald-300" : "text-rose-300"}`}>
                  {normalize(selected)===normalize(current.answer) ? "¡Correcto! 🎉" : "No era esa."}
                </p>
                <p className="mt-1 text-xs text-white/70"><span className="font-bold text-white">{current.answer}.</span> {current.note}</p>
                <FancyButton onClick={next} className="mt-3 w-full bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950 text-sm">
                  {index+1>=deck.length ? "Ver resultado" : "Siguiente →"}
                </FancyButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <FancyButton onClick={restart} className="w-full bg-white/10 text-white text-sm">
        <span className="inline-flex items-center justify-center gap-2"><RotateCcw className="h-3 w-3" /> Volver al menú</span>
      </FancyButton>
    </div>
  );
}

function ResultScreen({ result, leaderboard, restart, goMenu }) {
  const title = result.percent>=90 ? "Gaón de Torá 👑" : result.percent>=75 ? "Jajam destacado 🌟" : result.percent>=55 ? "Buen talmid 📖" : "Explorador valiente 🗺️";
  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#facc15_0,transparent_50%)] opacity-15" />
        <motion.div initial={{ scale:0.5, rotate:-15 }} animate={{ scale:1, rotate:0 }} className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 shadow-2xl shadow-amber-400/30">
          <Trophy className="h-10 w-10 text-white" />
        </motion.div>
        <h2 className="relative mt-4 text-2xl font-black">{title}</h2>
        <p className="relative mt-2 text-sm text-white/70"><span className="font-black text-amber-200">{result.score}</span> correctas de {result.total} · mejor racha {result.bestStreak}</p>
        <div className="relative mt-4 grid grid-cols-3 gap-2">
          <StatBox label="Correctas" value={result.score} />
          <StatBox label="Acierto" value={`${result.percent}%`} tone="text-cyan-200" />
          <StatBox label="Racha" value={result.bestStreak} tone="text-fuchsia-200" />
        </div>
        <div className="relative mt-4 flex gap-3">
          <FancyButton onClick={restart} className="flex-1 bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950 text-sm">Jugar otra vez</FancyButton>
          <FancyButton onClick={goMenu} className="flex-1 bg-white/10 text-white text-sm">Al menú</FancyButton>
        </div>
      </section>
      {leaderboard.length > 0 && (
        <section className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-amber-200" /><h3 className="font-black">Ranking actualizado</h3></div>
          <div className="space-y-2">
            {leaderboard.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2">
                <span className="text-sm font-bold">#{idx+1} · {item.title} · {item.difficulty}</span>
                <span className="font-black text-amber-200">{item.score} / {item.percent}%</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function TorahQuestGame() {
  const [screen, setScreen] = useState("menu");
  const [deck, setDeck] = useState([]);
  const [meta, setMeta] = useState(difficultyOptions[1]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => setLeaderboard(loadScores()), []);

  const startGame = (difficulty) => {
    const pool = ALL_QUESTIONS.filter((q) => q.level <= difficulty.level);
    setDeck(shuffle(pool).slice(0, difficulty.count).map(prepareQuestion));
    setMeta(difficulty); setResult(null); setScreen("game");
  };

  const finishGame = (finalResult) => {
    const title = finalResult.percent>=90 ? "Gaón" : finalResult.percent>=75 ? "Jajam" : finalResult.percent>=55 ? "Talmid" : "Aprendiz";
    const updated = saveScore({ ...finalResult, title, date: new Date().toISOString() });
    setLeaderboard(updated); setResult(finalResult); setScreen("result");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#4c1d95_0,#111827_34%,#020617_72%)] text-white" style={{ fontFamily:"'Rubik', sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute left-4 top-8 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>
      <main className="relative mx-auto max-w-lg px-4 py-4 pb-8">
        <header className="mb-4 flex items-center justify-between rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate:[0,-6,6,0] }} transition={{ repeat:Infinity, duration:4 }} className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-600 shadow-xl">
              <ScrollText className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Torá Quest</h1>
              <p className="text-[10px] text-white/60">{ALL_QUESTIONS.length} preguntas · {categories.length} categorías</p>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
            {leaderboard.length > 0 ? `🏆 ${leaderboard.length}` : "v2.0"}
          </span>
        </header>
        <AnimatePresence mode="wait">
          {screen==="menu" && <motion.div key="menu" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-14 }}><MenuScreen startGame={startGame} leaderboard={leaderboard} /></motion.div>}
          {screen==="game" && <motion.div key="game" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-14 }}><GameScreen deck={deck} meta={meta} finishGame={finishGame} restart={() => setScreen("menu")} /></motion.div>}
          {screen==="result" && result && <motion.div key="result" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-14 }}><ResultScreen result={result} leaderboard={leaderboard} restart={() => startGame(meta)} goMenu={() => setScreen("menu")} /></motion.div>}
        </AnimatePresence>
      </main>
    </div>
  );
}
