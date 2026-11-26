import { BibleVerse, DevotionalLength, DevotionalVariant, SupportedLang } from '../types/scripture';

export interface SeededSongContent {
  title: string;
  tempoNote: string;
  verse1: string[];
  chorus: string[];
  verse2: string[];
  bridge: string[];
}

export interface SeededChapterData {
  key: string;
  bookSlug: string;
  chapter: number;
  title: string;
  topics: string[];
  verses: Partial<Record<SupportedLang, BibleVerse[]>> & { en: BibleVerse[] };
  devotionalCore: {
    title: string;
    historicalBackground: string[];
    theologicalContext: string[];
    practicalApplication: string[];
    reflectionPrayer: string;
    localizedTitle?: Partial<Record<SupportedLang, string>>;
    localizedSummary?: Partial<Record<SupportedLang, {
      historicalBackground: string;
      theologicalContext: string;
      practicalApplication: string;
      reflectionPrayer: string;
    }>>;
  };
  lyrics: SeededSongContent & {
    localized?: Partial<Record<SupportedLang, SeededSongContent>>;
  };
}

export const SEEDED_CORPUS: SeededChapterData[] = [
  {
    key: 'genesis_1',
    bookSlug: 'genesis',
    chapter: 1,
    title: 'In the Beginning: Light, Order & Creation',
    topics: ['creation', 'beginning', 'light', 'purpose', 'order', 'peace', 'origin', 'word', '創造', '创造', '起初', '光明'],
    verses: {
      en: [
        { verse: 1, text: 'In the beginning, God created the heavens and the earth.' },
        { verse: 2, text: 'The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.' },
        { verse: 3, text: 'God said, “Let there be light,” and there was light.' },
        { verse: 4, text: 'God saw the light, and saw that it was good. God divided the light from the darkness.' },
        { verse: 5, text: 'God called the light “day”, and the darkness he called “night”. There was evening and there was morning, the first day.' },
        { verse: 6, text: 'God said, “Let there be an expanse in the middle of the waters, and let it divide the waters from the waters.”' },
        { verse: 7, text: 'God made the expanse, and divided the waters which were under the expanse from the waters which were above the expanse; and it was so.' },
        { verse: 8, text: 'God called the expanse “sky”. There was evening and there was morning, a second day.' },
        { verse: 9, text: 'God said, “Let the waters under the sky be gathered together to one place, and let the dry land appear”; and it was so.' },
        { verse: 10, text: 'God called the dry land “earth”, and the gathering together of the waters he called “seas”. God saw that it was good.' },
        { verse: 11, text: 'God said, “Let the earth yield grass, herbs yielding seeds, and fruit trees bearing fruit after their kind, with their seeds in it, on the earth”; and it was so.' },
        { verse: 14, text: 'God said, “Let there be lights in the expanse of the sky to divide the day from the night; and let them be for signs to mark seasons, days, and years.”' },
        { verse: 26, text: 'God said, “Let’s make man in our image, after our likeness. Let them have dominion over the fish of the sea, and over the birds of the sky, and over the livestock, and over all the earth.”' },
        { verse: 27, text: 'God created man in his own image. In God’s image he created him; male and female he created them.' },
        { verse: 31, text: 'God saw everything that he had made, and, behold, it was very good. There was evening and there was morning, a sixth day.' },
      ],
      zh: [
        { verse: 1, text: '起初，神創造天地。' },
        { verse: 2, text: '地是空虛混沌，淵面黑暗；神的靈運行在水面上。' },
        { verse: 3, text: '神說：「要有光」，就有了光。' },
        { verse: 4, text: '神看光是好的，就把光暗分開了。' },
        { verse: 5, text: '神稱光為「晝」，稱暗為「夜」。有晚上，有早晨，這是頭一日。' },
        { verse: 27, text: '神就照著自己的形像造人，乃是照著他的形像造男造女。' },
        { verse: 31, text: '神看著一切所造的都甚好。有晚上，有早晨，是第六日。' },
      ],
      'zh-CN': [
        { verse: 1, text: '起初，神创造天地。' },
        { verse: 2, text: '地是空虚混沌，渊面黑暗；神的灵运行在水面上。' },
        { verse: 3, text: '神说：「要有光」，就有了光。' },
        { verse: 4, text: '神看光是好的，就把光暗分开了。' },
        { verse: 5, text: '神称光为「昼」，称暗为「夜」。有晚上，有早晨，这是头一日。' },
        { verse: 27, text: '神就照着自己的形像造人，乃是照着他的形像造男造女。' },
        { verse: 31, text: '神看着一切所造的都甚好。有晚上，有早晨，是第六日。' },
      ],
      es: [
        { verse: 1, text: 'En el principio creó Dios los cielos y la tierra.' },
        { verse: 2, text: 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.' },
        { verse: 3, text: 'Y dijo Dios: Sea la luz; y fue la luz.' },
        { verse: 4, text: 'Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.' },
        { verse: 5, text: 'Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana un día.' },
        { verse: 27, text: 'Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.' },
        { verse: 31, text: 'Y vio Dios todo lo que había hecho, y he aquí que era bueno en gran manera.' },
      ],
      fr: [
        { verse: 1, text: 'Au commencement, Dieu créa les cieux et la terre.' },
        { verse: 2, text: 'La terre était informe et vide : il y avait des ténèbres à la surface de l’abîme, et l’Esprit de Dieu se mouvait au-dessus des eaux.' },
        { verse: 3, text: 'Dieu dit : Que la lumière soit ! Et la lumière fut.' },
        { verse: 4, text: 'Dieu vit que la lumière était bonne ; et Dieu sépara la lumière d’avec les ténèbres.' },
        { verse: 27, text: 'Dieu créa l’homme à son image, il le créa à l’image de Dieu, il créa l’homme et la femme.' },
        { verse: 31, text: 'Dieu vit tout ce qu’il avait fait et voici, cela était très bon.' },
      ],
      de: [
        { verse: 1, text: 'Am Anfang schuf Gott Himmel und Erde.' },
        { verse: 2, text: 'Und die Erde war wüst und leer, und es war finster auf der Tiefe; und der Geist Gottes schwebte auf dem Wasser.' },
        { verse: 3, text: 'Und Gott sprach: Es werde Licht! Und es ward Licht.' },
        { verse: 4, text: 'Und Gott sah, daß das Licht gut war. Da schied Gott das Licht von der Finsternis.' },
        { verse: 27, text: 'Und Gott schuf den Menschen ihm zum Bilde, zum Bilde Gottes schuf er ihn; und schuf sie einen Mann und ein Weib.' },
        { verse: 31, text: 'Und Gott sah an alles, was er gemacht hatte; und siehe da, es war sehr gut.' },
      ],
      pt: [
        { verse: 1, text: 'No princípio criou Deus os céus e a terra.' },
        { verse: 2, text: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.' },
        { verse: 3, text: 'E disse Deus: Haja luz; e houve luz.' },
        { verse: 27, text: 'E criou Deus o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.' },
        { verse: 31, text: 'E viu Deus tudo quanto tinha feito, e eis que era muito bom.' },
      ],
      it: [
        { verse: 1, text: 'Nel principio Dio creò i cieli e la terra.' },
        { verse: 2, text: 'La terra era informe e vuota, le tenebre coprivano la faccia dell’abisso e lo Spirito di Dio aleggiava sulla superficie delle acque.' },
        { verse: 3, text: 'Dio disse: «Sia la luce!». E la luce fu.' },
        { verse: 31, text: 'Dio vide tutto quello che aveva fatto, ed ecco, era molto buono.' },
      ],
      ja: [
        { verse: 1, text: 'はじめに神は天と地とを創造された。' },
        { verse: 2, text: '地は形なく、むなしく、やみが淵のおもてにあり、神の霊が水のおもてをおおっていた。' },
        { verse: 3, text: '神は「光あれ」と言われた。すると光があった。' },
        { verse: 31, text: '神が造ったすべての物を見られたところ、それは、はなはだ良かった。' },
      ],
      ko: [
        { verse: 1, text: '태초에 하나님이 천지를 창조하시니라' },
        { verse: 2, text: '땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 신은 수면에 운행하시니라' },
        { verse: 3, text: '하나님이 가라사대 빛이 있으라 하시매 빛이 있었고' },
        { verse: 31, text: '하나님이 그 지으신 모든 것을 보시니 보시기에 심히 좋았더라' },
      ],
      hi: [
        { verse: 1, text: 'आदि में परमेश्वर ने आकाश और पृथ्वी की सृष्टि की।' },
        { verse: 2, text: 'और पृथ्वी बेडौल और सुनसान पड़ी थी; और गहरे जल के ऊपर अन्धियारा था: तथा परमेश्वर का आत्मा जल के ऊपर मण्डलाता था।' },
        { verse: 3, text: 'तब परमेश्वर ने कहा, उजियाला हो: तो उजियाला हो गया।' },
        { verse: 31, text: 'तब परमेश्वर ने जो कुछ बनाया था, सब को देखा, तो क्या देखा, कि वह बहुत ही अच्छा है।' },
      ],
    },
    devotionalCore: {
      title: 'Out of Formless Silence, the First Dawn',
      localizedTitle: {
        zh: '混沌寂靜之中，第一道曙光',
        'zh-CN': '混沌寂静之中，第一道曙光',
        es: 'De la Quietud Sin Forma, el Primer Alba',
        fr: 'Hors du Silence Informe, la Première Aube',
        de: 'Aus Gestaltloser Stille, das Erste Morgenrot',
      },
      historicalBackground: [
        'Genesis 1 was preserved and recited within an ancient Near Eastern world where neighboring cultures imagined creation as the violent aftermath of warring deities. By contrast, the Hebrew opening—Bereshit bara Elohim—introduces a single sovereign Creator whose word brings order without struggle.',
        'Notice the rhythmic symmetry of the six days: Days 1 through 3 form the realms (light and darkness, sky and sea, land and vegetation), while Days 4 through 6 fill those realms with rulers and inhabitants (luminaries, birds and fish, land creatures and humanity).',
        'For early hearers living in exile or wandering through the wilderness, this liturgical structure functioned as an anchor of cosmic stability: the world is not an accident of chaos, nor are human beings an afterthought.',
      ],
      theologicalContext: [
        'The Spirit of God (ruach Elohim) hovering over the primordial waters evokes a mother bird brooding over a nest—presence before form, tenderness before structure. Creation begins not with cold mechanics, but with attentive nearness.',
        'Repeatedly, the text affirms that what God makes is tov (“good”), culminating on the sixth day in tov me’od (“very good”). Material existence—light, water, soil, bodies, and seasons—is intrinsically affirmed.',
        'Humanity’s designation as the image of God (imago Dei) democratizes what ancient empires reserved solely for kings: every person carries sacred dignity and stewardship on earth.',
      ],
      practicalApplication: [
        'When your week feels “formless and empty,” Genesis 1 reminds you that God’s Spirit hovers over unfinished places long before order becomes visible. Chaos is not the absence of God; it is the canvas of his next spoken word.',
        'Honor the cadence of evening and morning. Notice that the biblical day begins at evening—rest precedes productivity, reminding us that we work from blessing rather than to earn it.',
        'Carry the dignity of the image of God into ordinary relationships today: look at every neighbor, coworker, and quiet task as part of a world called good.',
      ],
      reflectionPrayer:
        'Creator of dawn and deep waters, speak calm into the unformed spaces of my mind today. Help me rest in your hovering presence, see goodness in your world, and reflect your grace toward everyone I meet. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '《創世記》第一章是在古代近東文化背景下寫成的。當時周邊民族多把宇宙起源描繪為諸神爭戰的產物，但希伯來聖經開篇便宣告：獨一真神以話語創造萬有，毫無爭競，滿有秩序與榮美。前三天開闢空間，後三天充滿萬物，展現出莊嚴的秩序。',
          theologicalContext:
            '「神的靈運行在水面上」如母鳥覆雛般溫柔看顧，說明創造始於神的同在與眷顧。經文七次宣告神看著所造的「是好的」，第六日更稱為「甚好」，肯定了物質世界與生命的尊貴；人按著神的形像受造，賦予每個人無可取代的尊嚴。',
          practicalApplication:
            '當你的生活感到「空虛混沌」時，請記得神的靈正運行在尚未成形之處。聖經的一天從「有晚上，有早晨」開始，提醒我們安息先於勞碌。今天，以溫柔與尊重看待身邊的每一位鄰舍與日常工作。',
          reflectionPrayer:
            '創造清晨與深淵的主，求祢今日向我心中的混沌發聲，賜下平安。幫助我在祢的同在中安息，看見祢所造世界的良善，並把祢的恩典帶給今天遇見的每一個人。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '《创世记》第一章是在古代近东文化背景下写成的。当时周边民族多把宇宙起源描绘为诸神争战的产物，但希伯来圣经开篇便宣告：独一真神以话语创造万有，毫无争竞，满有秩序与荣美。前三天开辟空间，后三天充满万物，展现出庄严的秩序。',
          theologicalContext:
            '「神的灵运行在水面上」如母鸟覆雏般温柔看顾，说明创造始于神的同在与眷顾。经文七次宣告神看着所造的「是好的」，第六日更称为「甚好」，肯定了物质世界与生命的尊贵；人按着神的形像受造，赋予每个人无可取代的尊严。',
          practicalApplication:
            '当你的生活感到「空虚混沌」时，请记得神的灵正运行在尚未成形之处。圣经的一天从「有晚上，有早晨」开始，提醒我们安息先于劳碌。今天，以温柔与尊重看待身边的每一位邻舍与日常工作。',
          reflectionPrayer:
            '创造清晨与深渊的主，求你今日向我心中的混沌发声，赐下平安。帮助我在你的同在中安息，看见你所造世界的良善，并把你的恩典带给今天遇见的每一个人。阿们。',
        },
      },
    },
    lyrics: {
      title: 'Speak Light Over the Deep',
      tempoNote: 'Slow hymn · 68 BPM · C Major',
      verse1: [
        'Before the mountains knew their name,',
        'Before the tides began to keep,',
        'Your Spirit moved upon the dark,',
        'A gentle breath above the deep.',
      ],
      chorus: [
        'Speak light into the shadow,',
        'Speak order to the sea;',
        'The voice that framed the morning sky',
        'Is speaking peace to me.',
      ],
      verse2: [
        'You shaped the dusk, You named the dawn,',
        'You called the barren earth to bloom,',
        'And breathed Your image into dust',
        'To walk within Your living room.',
      ],
      bridge: [
        'Evening passes, morning wakes,',
        'Every promise holds its frame;',
        'What You began is very good,',
        'And all creation bears Your name.',
      ],
      localized: {
        zh: {
          title: '在深淵之上發出光來',
          tempoNote: '聖詩慢板 · 68 BPM · C大調',
          verse1: ['群山尚未立定根基，', '海潮尚未學會歌唱，', '祢的靈運行在黑暗中，', '溫柔氣息覆庇水面上。'],
          chorus: ['向幽暗發出光來，', '向深海宣告平安；', '那鋪張晨曦的聲音，', '正使我心靈得安息。'],
          verse2: ['祢分開黑夜與清晨，', '祢使荒蕪大地開花，', '將祢形像吹入塵土，', '使我們同行在祢家。'],
          bridge: ['有晚上也有早晨，', '每個應許永不改變；', '祢手所造都甚美好，', '萬物齊聲稱頌祢名。'],
        },
        'zh-CN': {
          title: '在深渊之上发出光来',
          tempoNote: '圣诗慢板 · 68 BPM · C大调',
          verse1: ['群山尚未立定根基，', '海潮尚未学会歌唱，', '你的灵运行在黑暗中，', '温柔气息覆庇水面上。'],
          chorus: ['向幽暗发出光来，', '向深海宣告平安；', '那铺张晨曦的声音，', '正使我心灵得安息。'],
          verse2: ['你分开黑夜与清晨，', '你使荒芜大地开花，', '将你形像吹入尘土，', '使我们同行在你家。'],
          bridge: ['有晚上也有早晨，', '每个应许永不改变；', '你手所造都甚美好，', '万物齐声称颂你名。'],
        },
      },
    },
  },
  {
    key: 'psalm_23',
    bookSlug: 'psalm',
    chapter: 23,
    title: 'The Shepherd in the Valley of Still Waters',
    topics: ['comfort', 'anxiety', 'fear', 'peace', 'shepherd', 'rest', 'guidance', 'protection', 'strength', '牧者', '平安', '安慰', '力量'],
    verses: {
      en: [
        { verse: 1, text: 'Yahweh is my shepherd: I shall lack nothing.' },
        { verse: 2, text: 'He makes me lie down in green pastures. He leads me beside still waters.' },
        { verse: 3, text: 'He restores my soul. He guides me in the paths of righteousness for his name’s sake.' },
        { verse: 4, text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.' },
        { verse: 5, text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over.' },
        { verse: 6, text: 'Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh’s house forever.' },
      ],
      zh: [
        { verse: 1, text: '耶和華是我的牧者，我必不至缺乏。' },
        { verse: 2, text: '他使我躺臥在青草地上，領我在可安歇的水邊。' },
        { verse: 3, text: '他使我的靈魂甦醒，為自己的名引導我走義路。' },
        { verse: 4, text: '我雖然行過死蔭的幽谷，也不怕遭害，因為你與我同在；你的杖，你的竿，都安慰我。' },
        { verse: 5, text: '在我敵人面前，你為我擺設筵席；你用油膏了我的頭，使我的福杯滿溢。' },
        { verse: 6, text: '我一生一世必有恩惠慈愛隨著我；我且要住在耶和華的殿中，直到永遠。' },
      ],
      'zh-CN': [
        { verse: 1, text: '耶和华是我的牧者，我必不至缺乏。' },
        { verse: 2, text: '他使我躺卧在青草地上，领我在可安歇的水边。' },
        { verse: 3, text: '他使我的灵魂苏醒，为自己的名引导我走义路。' },
        { verse: 4, text: '我虽然行过死荫的幽谷，也不怕遭害，因为你与我同在；你的杖，你的竿，都安慰我。' },
        { verse: 5, text: '在我敌人面前，你为我摆设筵席；你用油膏了我的头，使我的福杯满溢。' },
        { verse: 6, text: '我一生一世必有恩惠慈爱随着我；我且要住在耶和华的殿中，直到永远。' },
      ],
      es: [
        { verse: 1, text: 'Jehová es mi pastor; nada me faltará.' },
        { verse: 2, text: 'En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.' },
        { verse: 3, text: 'Confortará mi alma; me guiará por sendas de justicia por amor de su nombre.' },
        { verse: 4, text: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.' },
        { verse: 5, text: 'Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosando.' },
        { verse: 6, text: 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días.' },
      ],
      fr: [
        { verse: 1, text: 'L’Éternel est mon berger : je ne manquerai de rien.' },
        { verse: 2, text: 'Il me fait reposer dans de verts pâturages, il me dirige près des eaux paisibles.' },
        { verse: 3, text: 'Il restaure mon âme, il me conduit dans les sentiers de la justice, à cause de son nom.' },
        { verse: 4, text: 'Quand je marche dans la vallée de l’ombre de la mort, je ne crains aucun mal, car tu es avec moi : ta houlette et ton bâton me rassurent.' },
        { verse: 5, text: 'Tu dresses devant moi une table, en face de mes adversaires ; tu oins d’huile ma tête, et ma coupe déborde.' },
        { verse: 6, text: 'Oui, le bonheur et la grâce m’accompagneront tous les jours de ma vie, et j’habiterai dans la maison de l’Éternel jusqu’à la fin des jours.' },
      ],
      de: [
        { verse: 1, text: 'Der HERR ist mein Hirte; mir wird nichts mangeln.' },
        { verse: 2, text: 'Er weidet mich auf einer grünen Aue und führet mich zum frischen Wasser.' },
        { verse: 3, text: 'Er erquicket meine Seele; er führet mich auf rechter Straße um seines Namens willen.' },
        { verse: 4, text: 'Und ob ich schon wanderte im finstern Tal, fürchte ich kein Unglück; denn du bist bei mir, dein Stecken und Stab trösten mich.' },
        { verse: 5, text: 'Du bereitest vor mir einen Tisch im Angesicht meiner Feinde. Du salbest mein Haupt mit Öl und schenkest mir voll ein.' },
        { verse: 6, text: 'Gutes und Barmherzigkeit werden mir folgen mein Leben lang, und ich werde bleiben im Hause des HERRN immerdar.' },
      ],
      pt: [
        { verse: 1, text: 'O Senhor é o meu pastor; nada me faltará.' },
        { verse: 2, text: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.' },
        { verse: 3, text: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.' },
        { verse: 4, text: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
        { verse: 5, text: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
        { verse: 6, text: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' },
      ],
      it: [
        { verse: 1, text: 'Il SIGNORE è il mio pastore: nulla mi manca.' },
        { verse: 2, text: 'Egli mi fa riposare in verdeggianti pascoli, mi guida lungo le acque calme.' },
        { verse: 3, text: 'Egli mi ristora l’anima, mi conduce per sentieri di giustizia, per amor del suo nome.' },
        { verse: 4, text: 'Quand’anche camminassi nella valle dell’ombra della morte, io non temerei alcun male, perché tu sei con me; il tuo bastone e la tua verga mi danno sicurezza.' },
        { verse: 5, text: 'Tu apparecchi davanti a me la mensa, in presenza dei miei nemici; cospargi d’olio il mio capo; la mia coppa trabocca.' },
        { verse: 6, text: 'Certo, beni e bontà m’accompagneranno tutti i giorni della mia vita; e abiterò nella casa del SIGNORE per lunghi giorni.' },
      ],
      ja: [
        { verse: 1, text: '主はわたしの牧者であって、わたしには乏しいことがない。' },
        { verse: 2, text: '主はわたしを緑の牧場に伏させ、いこいのみぎわに伴われる。' },
        { verse: 3, text: '主はわたしのたましいを生きかえらせ、み名のためにわたしを正しい道に導かれる。' },
        { verse: 4, text: 'たといわたしは死の陰の谷を歩むとも、災を恐れません。あなたがわたしと共におられるからです。あなたのむちと、あなたのつえはわたしを慰めます。' },
        { verse: 5, text: 'あなたはわたしの敵の前で、わたしの前にテーブルを設け、わたしのこうべに油をそそがれる。わたしの杯はあふれます。' },
        { verse: 6, text: 'わたしの生きているかぎりは必ず恵みとあわれみとが伴うでしょう。わたしはとこしえに主の宮に住むでしょう。' },
      ],
      ko: [
        { verse: 1, text: '여호와는 나의 목자시니 내가 부족함이 없으리로다' },
        { verse: 2, text: '그가 나를 푸른 초장에 누이시며 쉴만한 물 가으로 인도하시는도다' },
        { verse: 3, text: '내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다' },
        { verse: 4, text: '내가 사망의 음침한 골짜기로 다닐찌라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라 주의 지팡이와 막대기가 나를 안위하시나이다' },
        { verse: 5, text: '주께서 내 원수의 목전에서 내게 상을 베푸시고 기름으로 내 머리에 바르셨으니 내 잔이 넘치나이다' },
        { verse: 6, text: '나의 평생에 선하심과 인자하심이 정녕 나를 따르리니 내가 여호와의 집에 영원히 거하리로다' },
      ],
      hi: [
        { verse: 1, text: 'यहोवा मेरा चरवाहा है, मुझे कुछ घटी न होगी।' },
        { verse: 2, text: 'वह मुझे हरी हरी चराइयों में बैठाता है; वह मुझे सुखदाई जल के झरने के पास ले चलता है।' },
        { verse: 3, text: 'वह मेरे जी में जी ले आता है। धर्म के मार्गों में वह अपने नाम के निमित्त मेरी अगुवाई करता है।' },
        { verse: 4, text: 'चाहे मैं घोर अन्धकार से भरी हुई तराई में होकर चलूं, तौभी हानि से न डरूंगा; क्योंकि तू मेरे साथ रहता है; तेरे सोंटे और तेरी लाठी से मुझे शान्ति मिलती है।' },
        { verse: 5, text: 'तू मेरे सताने वालों के सामने मेरे लिये मेज़ बिछाता है; तू ने मेरे सिर पर तेल मला है, मेरा कटोरा उमण्ड रहा है।' },
        { verse: 6, text: 'निश्चय भलाई और करुणा जीवन भर मेरे साथ साथ बनी रहेंगी; और मैं यहोवा के धाम में सर्वदा वास करूंगा।' },
      ],
    },
    devotionalCore: {
      title: 'Accompanied Through the Shadowed Valley',
      localizedTitle: {
        zh: '幽谷同行的牧者',
        'zh-CN': '幽谷同行的牧者',
        es: 'Acompañado en el Valle de Sombra',
        fr: 'Accompagné dans la Vallée Ombragée',
        de: 'Begleitet im Finstern Tal',
      },
      historicalBackground: [
        'Attributed to David, who spent his youth tending flocks across the limestone hills and steep wadis of Judea, Psalm 23 draws on concrete pastoral realism rather than idyllic sentimentality.',
        'In the Judean wilderness, green pastures are rare pockets of seasonal grass, and "still waters" (mei menuchot) are calm pools built or cleared by a shepherd because sheep will not drink from rushing torrents.',
        'The "valley of the shadow of death" (tsalmavet) refers literally to deep, narrow ravines where sunlight barely reaches and predators wait. Moving a flock from winter highlands to spring grazing required walking straight through those canyons.',
      ],
      theologicalContext: [
        'Notice the intimate shift in pronouns halfway through the psalm. Verses 1–3 speak about God in the third person ("He makes me lie down," "He leads me"), but the moment the path enters the dark canyon in verse 4, the poet turns directly to God: "You are with me." Crisis strips away distant theology and invites direct address.',
        'The psalm closes by shifting metaphors from shepherd to royal host (verse 5). In ancient hospitality customs, anointing a guest’s head with fragrant oil and filling their cup signified full protection even while adversaries watched outside the tent.',
        'Even the verb "follow" in verse 6 (radaph) is unusually strong—the same word used for pursuing in battle. Goodness and covenant mercy (chesed) do not trail passively behind us; they actively pursue us.',
      ],
      practicalApplication: [
        'If anxiety keeps your mind racing, note verse 2: "He makes me lie down." Rest is not laziness; it is an act of trust under a faithful Shepherd’s watch.',
        'When facing uncertainty, grief, or hard decisions today, remember that the Shepherd does not promise absence of valleys—only unfailing companionship inside them.',
        'Practice gratitude by naming three ways your cup overflows today, even in the middle of unfinished pressures.',
      ],
      reflectionPrayer:
        'Faithful Shepherd, calm my anxious thoughts beside your still waters. When I walk through shadowed valleys today, remind me that your rod and staff are near, and let your steadfast mercy surround my steps. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '本詩為大衛所作，他年少時在猶大曠野的石灰岩山嶺與深谷牧羊，對牧羊人的艱辛與看顧瞭若指掌。猶大曠野少有茂盛草場，所謂「可安歇的水邊」，往往是牧羊人親手築堤攔出的平靜水池，因為羊群不敢在急流旁飲水。',
          theologicalContext:
            '請留意第四節人稱的親切轉換：前三節詩人以第三人稱談論「耶和華是我的牧者、祂使我躺臥」；但一走進死蔭幽谷，詩人立刻轉為第二人稱呼求：「因為祢與我同在」。患難叫我們不再只是談論神，而是與神面對面同行。第五節更轉為尊貴宴席，象徵神在敵人環伺中仍親自庇護。',
          practicalApplication:
            '若焦慮讓你徹夜難眠，請思想第二節：「祂使我躺臥」。在忙碌中安歇並非懶惰，而是信靠牧者看顧的表現。今天面對未知的壓力時，記住牧者並未應許沒有幽谷，卻應許在幽谷中寸步不離的同在。',
          reflectionPrayer:
            '信實的大牧者，求祢領我來到可安歇的水邊，撫平我焦慮的思緒。今天無論走過何種幽谷，提醒我祢的杖、祢的竿就在身旁，讓祢的恩惠慈愛時刻圍繞我的腳步。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '本诗为大卫所作，他年少时在犹大旷野的石灰岩山岭与深谷牧羊，对牧羊人的艰辛与看顾了若指掌。犹大旷野少有茂盛草场，所谓「可安歇的水边」，往往是牧羊人亲手筑堤拦出的平静水池，因为羊群不敢在急流旁饮水。',
          theologicalContext:
            '请留意第四节人称的亲切转换：前三节诗人以第三人称谈论「耶和华是我的牧者、他使我躺卧」；但一走进死荫幽谷，诗人立刻转为第二人称呼求：「因为你与我同在」。患难叫我们不再只是谈论神，而是与神面对面同行。第五节更转为尊贵筵席，象征神在敌人环伺中仍亲自庇护。',
          practicalApplication:
            '若焦虑让你彻夜难眠，请思想第二节：「他使我躺卧」。在忙碌中安歇并非懒惰，而是信靠牧者看顾的表现。今天面对未知的压力时，记住牧者并未应许没有幽谷，却应许在幽谷中寸步不离的同在。',
          reflectionPrayer:
            '信实的大牧者，求你领我来到可安歇的水边，抚平我焦虑的思绪。今天无论走过何种幽谷，提醒我你的杖、你的竿就在身旁，让你的恩惠慈爱时刻围绕我的脚步。阿们。',
        },
      },
    },
    lyrics: {
      title: 'Still Waters, Steadfast Guide',
      tempoNote: 'Reflective pastoral · 72 BPM · G Major',
      verse1: [
        'In quiet meadows washed in gold,',
        'Where rushing rivers learn to rest,',
        'You call my weary heart to breathe',
        'And lay its burden on Your chest.',
      ],
      chorus: [
        'Though shadows lengthen down the stone,',
        'I will not walk this path alone;',
        'Your rod and staff are comfort here,',
        'My Shepherd keeps me close and near.',
      ],
      verse2: [
        'Before my doubts You set a feast,',
        'With mercy poured until it spills;',
        'Your faithfulness pursues my steps',
        'Across the valleys and the hills.',
      ],
      bridge: [
        'All my days, goodness stays,',
        'Mercy holds me in its grace;',
        'Home at last within Your house,',
        'Resting in Your quiet place.',
      ],
      localized: {
        zh: {
          title: '可安歇的水邊',
          tempoNote: '牧歌默想 · 72 BPM · G大調',
          verse1: ['青草地上金光照耀，', '急流學會在岸邊安靜，', '祢喚我疲倦的心靈深呼吸，', '把重擔輕輕交託給祢。'],
          chorus: ['雖行過死蔭的幽谷，', '我並不孤單走這路；', '祢的杖與竿安慰我心，', '大牧者時刻緊緊守護。'],
          verse2: ['在憂慮前祢擺設筵席，', '恩膏滿溢使福杯湧流；', '祢的信實伴隨我腳蹤，', '越過高山也越過山丘。'],
          bridge: ['一生一世恩惠相隨，', '慈愛將我緊緊環繞；', '我要住在耶和華殿中，', '安息在祢永恆懷抱。'],
        },
        'zh-CN': {
          title: '可安歇的水边',
          tempoNote: '牧歌默想 · 72 BPM · G大调',
          verse1: ['青草地上金光照耀，', '急流学会在岸边安静，', '你唤我疲倦的心灵深呼吸，', '把重担轻轻交托给你。'],
          chorus: ['虽行过死荫的幽谷，', '我并不孤单走这路；', '你的杖与竿安慰我心，', '大牧者时刻紧紧守护。'],
          verse2: ['在忧虑前你摆设筵席，', '恩膏满溢使福杯涌流；', '你的信实伴随我脚踪，', '越过高山也越过山丘。'],
          bridge: ['一生一世恩惠相随，', '慈爱将我紧紧环绕；', '我要住在耶和华殿中，', '安息在你永恒怀抱。'],
        },
      },
    },
  },
  {
    key: '1corinthians_13',
    bookSlug: '1corinthians',
    chapter: 13,
    title: 'The More Excellent Way: Love That Never Fails',
    topics: ['love', 'patience', 'kindness', 'relationships', 'grace', 'hope', 'faith', 'humility', '愛', '爱', '恆久忍耐', '恒久忍耐', '恩慈'],
    verses: {
      en: [
        { verse: 1, text: 'If I speak with the languages of men and of angels, but don’t have love, I have become sounding brass, or a clanging cymbal.' },
        { verse: 2, text: 'If I have the gift of prophecy, and know all mysteries and all knowledge; and if I have all faith, so as to remove mountains, but don’t have love, I am nothing.' },
        { verse: 3, text: 'If I dole out all my goods to feed the poor, and if I give my body to be burned, but don’t have love, it profits me nothing.' },
        { verse: 4, text: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud,' },
        { verse: 5, text: 'doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked, takes no account of evil;' },
        { verse: 6, text: 'doesn’t rejoice in unrighteousness, but rejoices with the truth;' },
        { verse: 7, text: 'bears all things, believes all things, hopes all things, endures all things.' },
        { verse: 8, text: 'Love never fails. But where there are prophecies, they will be done away with. Where there are various languages, they will cease. Where there is knowledge, it will be done away with.' },
        { verse: 9, text: 'For we know in part and we prophesy in part;' },
        { verse: 10, text: 'but when that which is complete has come, then that which is partial will be done away with.' },
        { verse: 11, text: 'When I was a child, I spoke as a child, I felt as a child, I thought as a child. Now that I have become a man, I have put away childish things.' },
        { verse: 12, text: 'For now we see in a mirror, dimly, but then face to face. Now I know in part, but then I will know fully, even as I was also fully known.' },
        { verse: 13, text: 'But now faith, hope, and love remain—these three. The greatest of these is love.' },
      ],
      zh: [
        { verse: 1, text: '我若能說萬人的方言，並天使的話語，卻沒有愛，我就成了鳴的鑼，響的鈸一般。' },
        { verse: 2, text: '我若有先知講道之能，也明白各樣的奧秘，各樣的知識，而且有全備的信，叫我能夠移山，卻沒有愛，我就算不得甚麼。' },
        { verse: 3, text: '我若將所有的賙濟窮人，又捨己身叫人焚燒，卻沒有愛，仍然與我無益。' },
        { verse: 4, text: '愛是恆久忍耐，又有恩慈；愛是不嫉妒；愛是不自誇，不張狂，' },
        { verse: 5, text: '不做害羞的事，不求自己的益處，不輕易發怒，不計算人的惡，' },
        { verse: 6, text: '不喜歡不義，只喜歡真理；' },
        { verse: 7, text: '凡事包容，凡事相信，凡事盼望，凡事忍耐。' },
        { verse: 8, text: '愛是永不止息。先知講道之能終必歸於無有；說方言之能終必停止；知識也終必歸於無有。' },
        { verse: 12, text: '我們如今彷彿對著鏡子觀看，模糊不清，到那時就要面對面了。我如今所知道的有限，到那時就全知道，如同主知道我一樣。' },
        { verse: 13, text: '如今常存的有信，有望，有愛這三樣，其中最大的是愛。' },
      ],
      'zh-CN': [
        { verse: 1, text: '我若能说万人的方言，并天使的话语，却没有爱，我就成了鸣的锣，响的钹一般。' },
        { verse: 4, text: '爱是恒久忍耐，又有恩慈；爱是不嫉妒；爱是不自夸，不张狂，' },
        { verse: 5, text: '不做害羞的事，不求自己的益处，不轻易发怒，不计算人的恶，' },
        { verse: 6, text: '不喜欢不义，只喜欢真理；' },
        { verse: 7, text: '凡事包容，凡事相信，凡事盼望，凡事忍耐。' },
        { verse: 8, text: '爱是永不止息。' },
        { verse: 13, text: '如今常存的有信，有望，有爱这三样，其中最大的是爱。' },
      ],
      es: [
        { verse: 1, text: 'Si yo hablase lenguas humanas y angélicas, y no tengo amor, vengo a ser como metal que resuena, o címbalo que retiñe.' },
        { verse: 4, text: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece;' },
        { verse: 5, text: 'no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor;' },
        { verse: 6, text: 'no se goza de la injusticia, mas se goza de la verdad.' },
        { verse: 7, text: 'Todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.' },
        { verse: 8, text: 'El amor nunca deja de ser; pero las profecías se acabarán, y cesarán las lenguas, y la ciencia acabará.' },
        { verse: 13, text: 'Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor.' },
      ],
      fr: [
        { verse: 4, text: 'La charité est patiente, elle est pleine de bonté ; la charité n’est point envieuse ; la charité ne se vante point, elle ne s’enfle point d’orgueil,' },
        { verse: 5, text: 'elle ne fait rien de malhonnête, elle ne cherche point son intérêt, elle ne s’irrite point, elle ne soupçonne point le mal,' },
        { verse: 7, text: 'elle excuse tout, elle croit tout, elle espère tout, elle supporte tout.' },
        { verse: 8, text: 'La charité ne périt jamais.' },
        { verse: 13, text: 'Maintenant donc ces trois choses demeurent : la foi, l’espérance, la charité ; mais la plus grande de ces choses, c’est la charité.' },
      ],
      de: [
        { verse: 4, text: 'Die Liebe ist langmütig und freundlich, die Liebe eifert nicht, die Liebe treibt nicht Mutwillen, sie blähet sich nicht,' },
        { verse: 5, text: 'sie stellet sich nicht ungebärdig, sie suchet nicht das Ihre, sie läßt sich nicht erbittern, sie rechnet das Böse nicht zu,' },
        { verse: 7, text: 'sie verträgt alles, sie glaubet alles, sie hoffet alles, sie duldet alles.' },
        { verse: 8, text: 'Die Liebe höret nimmer auf.' },
        { verse: 13, text: 'Nun aber bleibt Glaube, Hoffnung, Liebe, diese drei; aber die Liebe ist die größte unter ihnen.' },
      ],
      pt: [
        { verse: 4, text: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece,' },
        { verse: 7, text: 'Tudo sofre, tudo crê, tudo espera, tudo suporta.' },
        { verse: 8, text: 'O amor nunca falha.' },
        { verse: 13, text: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.' },
      ],
      it: [
        { verse: 4, text: 'L’amore è paziente, è benevolo; l’amore non invidia; l’amore non si vanta, non si gonfia,' },
        { verse: 7, text: 'Ogni cosa scusa, ogni cosa crede, ogni cosa spera, ogni cosa sopporta.' },
        { verse: 13, text: 'Ora dunque queste tre cose durano: fede, speranza, amore; ma la più grande di esse è l’amore.' },
      ],
      ja: [
        { verse: 4, text: '愛は寛容であり、愛は情深い。また、ねたむことをしない。愛は高ぶらない、誇らない、' },
        { verse: 7, text: 'すべてを忍び、すべてを信じ、すべてを望み、すべてを耐える。' },
        { verse: 8, text: '愛はいつまでも絶えることがない。' },
        { verse: 13, text: 'それゆえ、信仰と希望と愛、この三つは、いつまでも残る。そのうちで最も大いなるものは、愛である。' },
      ],
      ko: [
        { verse: 4, text: '사랑은 오래 참고 사랑은 온유하며 투기하는 자가 되지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며' },
        { verse: 7, text: '모든 것을 참으며 모든 것을 믿으며 모든 것을 바라며 모든 것을 견디느니라' },
        { verse: 8, text: '사랑은 언제까지든지 떨어지지 아니하나' },
        { verse: 13, text: '그런즉 믿음, 소망, 사랑, 이 세 가지는 항상 있을 것인데 그 중에 제일은 사랑이라' },
      ],
      hi: [
        { verse: 4, text: 'प्रेम धीरजवन्त है, और कृपाल है; प्रेम डाह नहीं करता; प्रेम अपनी बड़ाई नहीं करता, और फूलता नहीं।' },
        { verse: 7, text: 'वह सब बातें सह लेता है, सब बातों की प्रतीति करता है, सब बातों की आशा रखता है, सब बातों में धीरज धरता है।' },
        { verse: 13, text: 'पर अब विश्वास, आशा, प्रेम ये तीनों स्थायी हैं, पर इन में सब से बड़ा प्रेम है।' },
      ],
    },
    devotionalCore: {
      title: 'Patience, Kindness, and the Architecture of Agape',
      localizedTitle: {
        zh: '恆久忍耐與永不止息的愛',
        'zh-CN': '恒久忍耐与永不止息的爱',
        es: 'Paciencia, Benignidad y el Amor que Permanece',
        fr: 'La Patience et l’Amour qui ne Périt Jamais',
        de: 'Geduld, Güte und die Bleibende Liebe',
      },
      historicalBackground: [
        'Though frequently read at weddings, 1 Corinthians 13 was originally written to a fractious urban congregation in Roman Corinth—a bustling port city obsessed with status, rhetorical brilliance, and spiritual prestige.',
        'Paul places this lyrical hymn directly between chapters 12 and 14, where members were competing over who possessed the most impressive gifts. Corinth prized polished bronze gongs and theatrical speech; Paul calls loveless eloquence mere noise.',
        'In verse 12, the phrase "see in a mirror, dimly" alludes directly to Corinth’s famous industry of burnished bronze mirrors, which yielded hazy reflections compared to clear glass.',
      ],
      theologicalContext: [
        'Every single descriptor of love in verses 4–7 is written in Greek as an active verb rather than an abstract noun: love acts patiently, acts kindly, keeps no ledger of wrongs.',
        'Agape is not a fragile emotion dependent on compatibility; it is the durable posture of God’s own character extending patience toward imperfect people.',
        'Faith and hope are essential pilgrims’ virtues for the present age, yet love alone endures unaltered into eternity because love is the very life of God.',
      ],
      practicalApplication: [
        'Notice the phrase "takes no account of evil" (verse 5)—an accounting term for keeping a ledger of offenses. Ask yourself today: what grievance am I still tallying that grace invites me to close?',
        'Practice "macrothumia" (long-tempered patience) in one frustrating conversation today: pause before replying, listen without self-defense, and choose kindness over winning an argument.',
        'Remember that knowledge and plans remain partial for now ("we see dimly"), so hold strong convictions paired with deep humility.',
      ],
      reflectionPrayer:
        'God of steadfast love, strip away my pride and impatience. Teach me to keep no ledger of wrongs, to rejoice in truth, and to carry your gentle endurance into every room I enter today. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '《哥林多前書》第十三章雖常在婚禮上頌讀，最初卻是保羅寫給羅馬帝國港口大城哥林多教會的書信。當時教會成員彼此爭競誰的恩賜與口才最出眾，保羅直言：若沒有愛，再華麗的言辭也不過是鳴的鑼、響的鈸。第十二節「對著鏡子觀看，模糊不清」，正呼應哥林多當地以磨光青銅鏡聞名的工藝。',
          theologicalContext:
            '第四至七節描寫愛的每一個詞彙，在希臘文原文中幾乎都是動詞而非靜態形容詞——愛是「恆久忍耐地去待人」、「以恩慈去行動」、「不計算人的惡」。信與望陪伴我們走過今生，惟獨愛永不止息，因為愛正是神自己的生命。',
          practicalApplication:
            '思想第五節「不計算人的惡」——原文是會計記帳的用詞。問問自己：我心中是否仍保留著一張未曾勾銷的怨恨帳本？今天在一次容易急躁的對話中，試著先停下來傾聽，選擇恩慈而非爭贏辯論。',
          reflectionPrayer:
            '恆久施愛的主，求祢挪去我的驕傲與急躁。教導我不再計算別人的過犯，只喜歡真理，並在今天所到之處活出溫柔而堅韌的愛。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '《哥林多前书》第十三章虽常在婚礼上诵读，最初却是保罗写给罗马帝国港口大城哥林多教会的书信。当时教会成员彼此争竞谁的恩赐与口才最出众，保罗直言：若没有爱，再华丽的言辞也不过是鸣的锣、响的钹。第十二节「对着镜子观看，模糊不清」，正呼应哥林多当地以磨光青铜镜闻名的工艺。',
          theologicalContext:
            '第四至七节描写爱的每一个词汇，在希腊文原文中几乎都是动词而非静态形容词——爱是「恒久忍耐地去待人」、「以恩慈去行动」、「不计算人的恶」。信与望陪伴我们走过今生，惟独爱永不止息，因为爱正是神自己的生命。',
          practicalApplication:
            '思想第五节「不计算人的恶」——原文是会计记账的用词。问问自己：我心中是否仍保留着一张未曾勾销的怨恨账本？今天在一次容易急躁的对话中，试着先停下来倾听，选择恩慈而非争赢辩论。',
          reflectionPrayer:
            '恒久施爱的主，求你挪去我的骄傲与急躁。教导我不再计算别人的过犯，只喜欢真理，并在今天所到之处活出温柔而坚韧的爱。阿们。',
        },
      },
    },
    lyrics: {
      title: 'The Greatest of These',
      tempoNote: 'Warm acoustic · 76 BPM · D Major',
      verse1: [
        'If I should speak in silver tongues',
        'And fathom mysteries untold,',
        'Without Your love my loudest praise',
        'Is hollow brass and fading gold.',
      ],
      chorus: [
        'Love is patient, love is kind,',
        'Keeps no ledger of the wrong;',
        'Through every shadow we see dim,',
        'Yet love remains forever strong.',
      ],
      verse2: [
        'It bears the weight, it hopes the best,',
        'It lays its own advantage down,',
        'Rejoicing where the truth takes root',
        'Without a boast or borrowed crown.',
      ],
      bridge: [
        'Faith will anchor, hope will rise,',
        'Until we see You face to face;',
        'And greatest still of all that stays',
        'Is love, unending in Your grace.',
      ],
      localized: {
        zh: {
          title: '其中最大的是愛',
          tempoNote: '溫暖木吉他 · 76 BPM · D大調',
          verse1: ['我若能說萬人的方言，', '又明白諸般的奧秘，', '若沒有愛在心裡運行，', '不過是響鈸空洞聲音。'],
          chorus: ['愛是恆久忍耐又有恩慈，', '不計算人過犯的帳簿；', '如今彷彿對鏡模糊觀看，', '愛卻永不止息直到永遠。'],
          verse2: ['凡事包容也凡事盼望，', '不求自己的益處與冠冕；', '不喜歡不義只喜悅真理，', '在靜默中顯出真實力量。'],
          bridge: ['信是錨定，望要升起，', '直到與祢面對面相見；', '常存的有信有望有愛，', '其中最大的永遠是愛。'],
        },
        'zh-CN': {
          title: '其中最大的是爱',
          tempoNote: '温暖木吉他 · 76 BPM · D大调',
          verse1: ['我若能说万人的方言，', '又明白诸般的奥秘，', '若没有爱在心里运行，', '不过是响钹空洞声音。'],
          chorus: ['爱是恒久忍耐又有恩慈，', '不计算人过犯的账簿；', '如今仿佛对镜模糊观看，', '爱却永不止息直到永远。'],
          verse2: ['凡事包容也凡事盼望，', '不求自己的益处与冠冕；', '不喜欢不义只喜悦真理，', '在静默中显出真实力量。'],
          bridge: ['信是锚定，望要升起，', '直到与你面对面相见；', '常存的有信有望有爱，', '其中最大的永远是爱。'],
        },
      },
    },
  },
  {
    key: 'john_3',
    bookSlug: 'john',
    chapter: 3,
    title: 'Wind in the Night & Light for the World',
    topics: ['grace', 'salvation', 'hope', 'rebirth', 'light', 'love', 'eternal', 'spirit', '救恩', '重生', '永生', '光'],
    verses: {
      en: [
        { verse: 1, text: 'Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.' },
        { verse: 2, text: 'The same came to him by night, and said to him, “Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do, unless God is with him.”' },
        { verse: 3, text: 'Jesus answered him, “Most certainly, I tell you, unless one is born anew, he can’t see God’s Kingdom.”' },
        { verse: 5, text: 'Jesus answered, “Most certainly I tell you, unless one is born of water and spirit, he can’t enter into God’s Kingdom.”' },
        { verse: 8, text: '“The wind blows where it wants to, and you hear its sound, but don’t know where it comes from and where it is going. So is everyone who is born of the Spirit.”' },
        { verse: 14, text: '“As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,”' },
        { verse: 15, text: '“that whoever believes in him should not perish, but have eternal life.”' },
        { verse: 16, text: '“For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.”' },
        { verse: 17, text: '“For God didn’t send his Son into the world to judge the world, but that the world should be saved through him.”' },
        { verse: 19, text: '“This is the judgment, that the light has come into the world, and men loved the darkness rather than the light; for their works were evil.”' },
        { verse: 21, text: '“But he who does the truth comes to the light, that his works may be revealed, that they have been done in God.”' },
      ],
      zh: [
        { verse: 1, text: '有一個法利賽人，名叫尼哥底母，是猶太人的官。' },
        { verse: 2, text: '這人夜裡來見耶穌，說：「拉比，我們知道你是由神那裡來作師傅的；因為你所行的神蹟，若沒有神同在，無人能行。」' },
        { verse: 3, text: '耶穌回答說：「我實實在在地告訴你，人若不重生，就不能見神的國。」' },
        { verse: 8, text: '「風隨著意思吹，你聽見風的響聲，卻不曉得從那裡來，往那裡去；凡從聖靈生的，也是如此。」' },
        { verse: 16, text: '「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不致滅亡，反得永生。」' },
        { verse: 17, text: '「因為神差他的兒子降世，不是要定世人的罪，乃是要叫世人因他得救。」' },
      ],
      'zh-CN': [
        { verse: 3, text: '耶稣回答说：「我实实在在地告诉你，人若不重生，就不能见神的国。」' },
        { verse: 8, text: '「风随着意思吹，你听见风的响声，却不晓得从那里来，往那里去；凡从圣灵生的，也是如此。」' },
        { verse: 16, text: '「神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不致灭亡，反得永生。」' },
        { verse: 17, text: '「因为神差他的儿子降世，不是要定世人的罪，乃是要叫世人因他得救。」' },
      ],
      es: [
        { verse: 3, text: 'Respondió Jesús y le dijo: De cierto, de cierto te digo, que el que no naciere de nuevo, no puede ver el reino de Dios.' },
        { verse: 8, text: 'El viento sopla de donde quiere, y oyes su sonido; mas ni sabes de dónde viene, ni a dónde va; así es todo aquel que es nacido del Espíritu.' },
        { verse: 16, text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
        { verse: 17, text: 'Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.' },
      ],
      fr: [
        { verse: 3, text: 'Jésus lui répondit : En vérité, en vérité, je te le dis, si un homme ne naît de nouveau, il ne peut voir le royaume de Dieu.' },
        { verse: 16, text: 'Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.' },
        { verse: 17, text: 'Dieu, en effet, n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui.' },
      ],
      de: [
        { verse: 3, text: 'Jesus antwortete und sprach zu ihm: Wahrlich, wahrlich, ich sage dir: Es sei denn, daß jemand von neuem geboren werde, so kann er das Reich Gottes nicht sehen.' },
        { verse: 16, text: 'Also hat Gott die Welt geliebt, daß er seinen eingebornen Sohn gab, auf daß alle, die an ihn glauben, nicht verloren werden, sondern das ewige Leben haben.' },
        { verse: 17, text: 'Denn Gott hat seinen Sohn nicht gesandt in die Welt, daß er die Welt richte, sondern daß die Welt durch ihn selig werde.' },
      ],
      pt: [
        { verse: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
        { verse: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
      ],
      it: [
        { verse: 16, text: 'Perché Dio ha tanto amato il mondo, che ha dato il suo unigenito Figlio, affinché chiunque crede in lui non perisca, ma abbia vita eterna.' },
        { verse: 17, text: 'Infatti Dio non ha mandato suo Figlio nel mondo per giudicare il mondo, ma perché il mondo sia salvato per mezzo di lui.' },
      ],
      ja: [
        { verse: 16, text: '神はそのひとり子を賜わったほどに、この世を愛してくださった。それは御子を信じる者がひとりも滅びないで、永遠の命を得るためである。' },
        { verse: 17, text: '神が御子を世につかわされたのは、世をさばくためではなく、御子によって世が救われるためである。' },
      ],
      ko: [
        { verse: 16, text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라' },
        { verse: 17, text: '하나님이 그 아들을 세상에 보내신 것은 세상을 심판하려 하심이 아니요 저로 말미암아 세상이 구원을 받게 하려 하심이라' },
      ],
      hi: [
        { verse: 16, text: 'क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा कि उस ने अपना एकलौता पुत्र दे दिया, ताकि जो कोई उस पर विश्वास करे, वह नष्ट न हो, परन्तु अनन्त जीवन पाए।' },
        { verse: 17, text: 'परमेश्वर ने अपने पुत्र को जगत में इसलिये नहीं भेजा, कि जगत पर दण्ड की आज्ञा दे परन्तु इसलिये कि जगत उसके द्वारा उद्धार पाए।' },
      ],
    },
    devotionalCore: {
      title: 'A Lantern Conversation About New Beginnings',
      localizedTitle: {
        zh: '夜深燈火下的重生對話',
        'zh-CN': '夜深灯火下的重生对话',
        es: 'Una Conversación Nocturna Sobre Renacer',
        fr: 'Un Entretien Nocturne sur la Nouvelle Naissance',
        de: 'Ein Nachtgespräch über den Neuanfang',
      },
      historicalBackground: [
        'Nicodemus was a respected member of the Sanhedrin, Jerusalem’s highest religious council. His arrival "by night" signals both caution among his peers and the quiet spiritual hunger beneath outward respectability.',
        'In Greek, Jesus’ phrase "born anew" (gennethe anothen) carries a rich double meaning: both "born again" and "born from above." Nicodemus hears the earthly sense first; Jesus gently lifts the conversation toward spiritual renewal.',
        'The mention of wind and Spirit draws on the same word (pneuma in Greek, ruach in Hebrew)—invisible, untamable, yet unmistakably felt in its effects.',
      ],
      theologicalContext: [
        'John 3:16 stands side by side with John 3:17: God’s initiative toward a broken world is not condemnation, but rescue. Love precedes judgment; generosity defines the gospel.',
        'Drawing on Moses lifting up the bronze serpent in Numbers 21, Jesus explains that healing comes not by earning perfection, but by looking in trust toward the one lifted up.',
        'Walking into the light (verse 21) is not a test for those who never stumble, but an invitation to honesty—bringing our real lives into the warmth of grace.',
      ],
      practicalApplication: [
        'You do not have to bring polished answers to God; Nicodemus arrived at night with honest questions, and Jesus met him patiently.',
        'Remember John 3:17 when an inner voice whispers shame: God sent his Son to save, not to crush.',
        'Pay attention today to the quiet "wind" of the Spirit—small nudges toward forgiveness, honesty, and generosity.',
      ],
      reflectionPrayer:
        'Lord of night and morning light, receive my honest questions as you received Nicodemus. Breathe new life into weary habits, and anchor my heart in the love that saves rather than condemns. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '尼哥底母是猶太公會德高望重的拉比，他選擇在「夜裡」來見耶穌，既顯出同儕目光下的謹慎，也反映了他內心深處對真理的渴慕。耶穌對他說「重生」（希臘文亦有「從上頭而生」之意），並以「風隨著意思吹」比喻聖靈看不見卻真實可感的工作。',
          theologicalContext:
            '約翰福音三章十六節必須與第十七節連讀：神愛世人，差遣獨生子不是為了定世人的罪，乃是要叫世人因祂得救。救贖的起點是神的主動慈愛，而不是人的自我證明；「來到光裡」也不是完美者的考試，而是帶著真實軟弱走進恩典的邀請。',
          practicalApplication:
            '你不必先整理好所有答案才來到神面前；尼哥底母帶著深夜的困惑而來，耶穌耐心與他長談。當內心出現自責或羞愧時，默想三章十七節：主來是為拯救，而非定罪。',
          reflectionPrayer:
            '掌管黑夜與黎明的主，求祢接納我真實的疑問，正如祢接納尼哥底母。將新的生命氣息吹入我疲乏的習慣中，使我的心牢牢紮根在祢拯救的大愛裡。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '尼哥底母是犹太公会德高望重的拉比，他选择在「夜里」来见耶稣，既显出同侪目光下的谨慎，也反映了他内心深处对真理的渴慕。耶稣对他说「重生」（希腊文亦有「从上头而生」之意），并以「风随着意思吹」比喻圣灵看不见却真实可感的工作。',
          theologicalContext:
            '约翰福音三章十六节必须与第十七节连读：神爱世人，差遣独生子不是为了定世人的罪，乃是要叫世人因他得救。救赎的起点是神的主动慈爱，而不是人的自我证明；「来到光里」也不是完美者的考试，而是带着真实软弱走进恩典的邀请。',
          practicalApplication:
            '你不必先整理好所有答案才来到神面前；尼哥底母带着深夜的困惑而来，耶稣耐心与他长谈。当内心出现自责或羞愧时，默想三章十七节：主来是为拯救，而非定罪。',
          reflectionPrayer:
            '掌管黑夜与黎明的主，求你接纳我真实的疑问，正如你接纳尼哥底母。将新的生命气息吹入我疲乏的习惯中，使我的心牢牢扎根在你拯救的大爱里。阿们。',
        },
      },
    },
    lyrics: {
      title: 'Lantern in the Courtyard',
      tempoNote: 'Contemplative · 66 BPM · E Minor to G Major',
      verse1: [
        'Beneath the quiet olive boughs,',
        'When city gates had gone to sleep,',
        'A seeker brought his questions out',
        'Where lantern shadows softly creep.',
      ],
      chorus: [
        'So loved the world, You gave Your Son,',
        'Not to condemn, but to restore;',
        'Like evening wind that wakes the trees,',
        'You open up an unseen door.',
      ],
      verse2: [
        'No measured step could climb so high,',
        'No learned scroll could make us new,',
        'Until the Spirit breathes within',
        'And draws the hidden heart to You.',
      ],
      bridge: [
        'Step from the dark into the light,',
        'Where grace is deeper than our fear;',
        'Eternal life begins tonight',
        'Because the Saving Word is near.',
      ],
      localized: {
        zh: {
          title: '夜深庭院的燈火',
          tempoNote: '沉思聖詠 · 66 BPM · G大調',
          verse1: ['橄欖樹影靜靜垂落，', '城門沉睡在夜色中，', '尋道者帶著心中的疑問，', '走向微光閃爍的庭院。'],
          chorus: ['神愛世人賜下獨生子，', '不是定罪乃是要拯救；', '如晚風輕輕吹醒林梢，', '祢為我開啟重生之門。'],
          verse2: ['沒有腳步能攀登天際，', '沒有書卷能更新靈魂，', '惟有聖靈在深處吹氣，', '領我回到祢的懷抱中。'],
          bridge: ['走出幽暗來到光裡，', '恩典比恐懼更加深廣；', '永恆生命就在今夜開始，', '因為救主的話語就在身旁。'],
        },
        'zh-CN': {
          title: '夜深庭院的灯火',
          tempoNote: '沉思圣咏 · 66 BPM · G大调',
          verse1: ['橄榄树影静静垂落，', '城门沉睡在夜色中，', '寻道者带着心中的疑问，', '走向微光闪烁的庭院。'],
          chorus: ['神爱世人赐下独生子，', '不是定罪乃是要拯救；', '如晚风轻轻吹醒林梢，', '你为我开启重生之门。'],
          verse2: ['没有脚步能攀登天际，', '没有书卷能更新灵魂，', '惟有圣灵在深处吹气，', '领我回到你的怀抱中。'],
          bridge: ['走出幽暗来到光里，', '恩典比恐惧更加深广；', '永恒生命就在今夜开始，', '因为救主的话语就在身旁。'],
        },
      },
    },
  },
  {
    key: 'philippians_4',
    bookSlug: 'philippians',
    chapter: 4,
    title: 'Peace Beyond Understanding in Anxious Hours',
    topics: ['anxiety', 'comfort', 'peace', 'joy', 'strength', 'prayer', 'gratitude', 'contentment', '焦慮', '焦虑', '安慰', '平安', '喜樂'],
    verses: {
      en: [
        { verse: 4, text: 'Rejoice in the Lord always! Again I will say, “Rejoice!”' },
        { verse: 5, text: 'Let your gentleness be known to all men. The Lord is at hand.' },
        { verse: 6, text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.' },
        { verse: 7, text: 'And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.' },
        { verse: 8, text: 'Finally, brothers, whatever things are true, whatever things are honorable, whatever things are just, whatever things are pure, whatever things are lovely, whatever things are of good report: if there is any virtue and if there is any praise, think about these things.' },
        { verse: 11, text: 'Not that I speak because of lack, for I have learned in whatever state I am, to be content in it.' },
        { verse: 13, text: 'I can do all things through Christ, who strengthens me.' },
      ],
      zh: [
        { verse: 4, text: '你們要靠主常常喜樂。我再說，你們要喜樂。' },
        { verse: 5, text: '當叫眾人知道你們謙讓的心。主已經近了。' },
        { verse: 6, text: '應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。' },
        { verse: 7, text: '神所賜、出人意外的平安必在基督耶穌裡保守你們的心懷意念。' },
        { verse: 8, text: '弟兄們，我還有未盡的話：凡是真實的、可敬的、公義的、清潔的、可愛的、有美名的，若有甚麼德行，若有甚麼稱讚，這些事你們都要思念。' },
        { verse: 11, text: '我並不是因缺乏說這話；我無論在甚麼景況都可以知足，這是我已經學會了。' },
        { verse: 13, text: '我靠著那加給我力量的，凡事都能做。' },
      ],
      'zh-CN': [
        { verse: 4, text: '你们要靠主常常喜乐。我再说，你们要喜乐。' },
        { verse: 5, text: '当叫众人知道你们谦让的心。主已经近了。' },
        { verse: 6, text: '应当一无挂虑，只要凡事藉着祷告、祈求，和感谢，将你们所要的告诉神。' },
        { verse: 7, text: '神所赐、出人意外的平安必在基督耶稣里保守你们的心怀意念。' },
        { verse: 8, text: '弟兄们，我还有未尽的话：凡是真实的、可敬的、公义的、清洁的、可爱的、有美名的，若有什么德行，若有什么称赞，这些事你们都要思念。' },
        { verse: 11, text: '我并不是因缺乏说这话；我无论在什么景况都可以知足，这是我已经学会了。' },
        { verse: 13, text: '我靠着那加给我力量的，凡事都能做。' },
      ],
      es: [
        { verse: 6, text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.' },
        { verse: 7, text: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.' },
        { verse: 13, text: 'Todo lo puedo en Cristo que me fortalece.' },
      ],
    },
    devotionalCore: {
      title: 'A Garrison of Peace Around the Mind',
      localizedTitle: {
        zh: '護衛心懷意念的平安駐軍',
        'zh-CN': '护卫心怀意念的平安驻军',
      },
      historicalBackground: [
        'Paul wrote Philippians 4 while under Roman house arrest, chained to imperial guards with his future uncertain. His call to peace is not detached advice—it is forged inside confinement.',
        'In verse 7, the verb "guard" (phroureo) is a Roman military term for a garrison standing watch around a walled city—vivid imagery for Philippi, a proud Roman colony.',
      ],
      theologicalContext: [
        'Notice that God’s peace is promised not because every problem vanishes on command, but because prayer with thanksgiving transfers the burden to a near Lord ("The Lord is at hand," verse 5).',
        'Verse 13 ("through Christ who strengthens me") sits directly after verse 11–12, meaning strength in plenty and strength in scarcity alike.',
      ],
      practicalApplication: [
        'Whenever worry loops in your mind today, turn each specific fear into a spoken request paired with one specific thank-you.',
        'Curate your attention according to verse 8: intentionally dwell on something true, honorable, and lovely before checking headlines.',
      ],
      reflectionPrayer:
        'Lord who stands near, take the worries I keep carrying alone. Station your peace like a quiet watch around my heart and thoughts today. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '保羅寫作《腓立比書》第四章時正被羅馬軍兵看守軟禁，前途未卜。他的勸勉並非高高在上的空談，而是在鎖鍊之中親身經歷的真實平安。第七節的「保守」在希臘原文中是軍事用語，意指羅馬駐軍在城門外日夜巡邏守望。',
          theologicalContext:
            '神所賜的平安並非因為環境瞬間消除所有困難，而是透過帶著感恩的禱告，將重擔交給那位「已經近了」的主。第十三節「凡事都能做」緊接在「知道如何處豐富也知道如何處卑賤」之後，意思是無論順境逆境，基督都加給我們承受的力量。',
          practicalApplication:
            '今天每當憂慮在腦海中盤旋時，把每一個具體的擔心化作禱告，並附上一句真實的感恩。同時按著第八節的提醒，刻意把注意力放在真實、可敬、可愛的事物上。',
          reflectionPrayer:
            '親近我們的主，求祢接過我獨自背負的掛慮，讓祢出人意外的平安像忠誠的守望者，保守我的心懷意念。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '保罗写作《腓立比书》第四章时正被罗马军兵看守软禁，前途未卜。他的劝勉并非高高在上的空谈，而是在锁链之中亲身经历的真实平安。第七节的「保守」在希腊原文中是军事用语，意指罗马驻军在城门外日夜巡逻守望。',
          theologicalContext:
            '神所赐的平安并非因为环境瞬间消除所有困难，而是透过带着感恩的祷告，将重担交给那位「已经近了」的主。第十三节「凡事都能做」紧接在「知道如何处丰富也知道如何处卑贱」之后，意思是无论顺境逆境，基督都加给我们承受的力量。',
          practicalApplication:
            '今天每当忧虑在脑海中盘旋时，把每一个具体的担心化作祷告，并附上一句真实的感恩。同时按着第八节的提醒，刻意把注意力放在真实、可敬、可爱的事物上。',
          reflectionPrayer:
            '亲近我们的主，求你接过我独自背负的挂虑，让你出人意外的平安像忠诚的守望者，保守我的心怀意念。阿们。',
        },
      },
    },
    lyrics: {
      title: 'Guard My Heart in Peace',
      tempoNote: 'Gentle folk · 74 BPM · F Major',
      verse1: [
        'When tomorrow weighs too heavy,',
        'And the mind begins to race,',
        'I will bring each quiet burden',
        'To the shelter of Your grace.',
      ],
      chorus: [
        'Peace beyond all understanding,',
        'Stand as watchman at the gate;',
        'Guard my heart and hold my thinking',
        'In the love that will not break.',
      ],
      verse2: [
        'What is noble, what is lovely,',
        'What is steady, pure, and true,',
        'Let my thoughts take root in goodness',
        'And remember what You do.',
      ],
      bridge: [
        'In abundance or in need,',
        'You are strength enough for me.',
      ],
      localized: {
        zh: {
          title: '在平安中保守我心',
          tempoNote: '溫柔民謠 · 74 BPM · F大調',
          verse1: ['當明日重擔壓在心頭，', '思緒像潮水般奔湧不停，', '我願把每份隱密的掛慮，', '帶到祢恩典的避風港裡。'],
          chorus: ['出人意外的平安啊，', '請像守望者站在城門口；', '保守我心懷與意念，', '安穩在祢永不改變的愛。'],
          verse2: ['凡是真實的、可敬的，', '凡是清潔、可愛與美善，', '願我的心紮根在恩惠裡，', '數算祢一路奇妙作為。'],
          bridge: ['無論處豐富或處缺乏，', '祢的同在就夠我用。'],
        },
        'zh-CN': {
          title: '在平安中保守我心',
          tempoNote: '温柔民谣 · 74 BPM · F大调',
          verse1: ['当明日重担压在心头，', '思绪像潮水般奔涌不停，', '我愿把每份隐密的挂虑，', '带到你恩典的避风港里。'],
          chorus: ['出人意外的平安啊，', '请像守望者站在城门口；', '保守我心怀与意念，', '安稳在你永不改变的爱。'],
          verse2: ['凡是真实的、可敬的，', '凡是清洁、可爱与美善，', '愿我的心扎根在恩惠里，', '数算你一路奇妙作为。'],
          bridge: ['无论处丰富或处缺乏，', '你的同在就够我用。'],
        },
      },
    },
  },
  {
    key: 'isaiah_40',
    bookSlug: 'isaiah',
    chapter: 40,
    title: 'Strength Renewed Like Eagles’ Wings',
    topics: ['strength', 'comfort', 'weariness', 'hope', 'patience', 'endurance', 'renewal', '力量', '等候', '安慰'],
    verses: {
      en: [
        { verse: 1, text: '“Comfort, comfort my people,” says your God.' },
        { verse: 8, text: 'The grass withers, the flower fades; but the word of our God stands forever.' },
        { verse: 28, text: 'Haven’t you known? Haven’t you heard? The everlasting God, Yahweh, the Creator of the ends of the earth, doesn’t faint. He isn’t weary. His understanding is unsearchable.' },
        { verse: 29, text: 'He gives power to the weak. He increases the strength of him who has no might.' },
        { verse: 30, text: 'Even the youths faint and get weary, and the young men utterly fall;' },
        { verse: 31, text: 'but those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.' },
      ],
      zh: [
        { verse: 1, text: '你們的神說：你們要安慰，安慰我的百姓。' },
        { verse: 8, text: '草必枯乾，花必凋殘，惟有我們神的話必永遠立定。' },
        { verse: 28, text: '你豈不曾知道嗎？你豈不曾聽見嗎？永在的神耶和華，創造地極的主，並不疲乏，也不困倦；他的智慧無法測度。' },
        { verse: 29, text: '疲乏的，他賜能力；軟弱的，他加力量。' },
        { verse: 30, text: '就是少年人也要疲乏困倦；強壯的也必全然跌倒。' },
        { verse: 31, text: '但那等候耶和華的必從新得力。他們必如鷹展翅上騰；他們奔跑卻不困倦，行走卻不疲乏。' },
      ],
      'zh-CN': [
        { verse: 1, text: '你们的神说：你们要安慰，安慰我的百姓。' },
        { verse: 8, text: '草必枯干，花必凋残，惟有我们神的话必永远立定。' },
        { verse: 28, text: '你岂不曾知道吗？你岂不曾听见吗？永在的神耶和华，创造地极的主，并不疲乏，也不困倦；他的智慧无法测度。' },
        { verse: 29, text: '疲乏的，他赐能力；软弱的，他加力量。' },
        { verse: 30, text: '就是少年人也要疲乏困倦；强壮的也必全然跌倒。' },
        { verse: 31, text: '但那等候耶和华的必从新得力。他们必如鹰展翅上腾；他们奔跑却不困倦，行走却不疲乏。' },
      ],
    },
    devotionalCore: {
      title: 'When Endurance Means Waiting',
      localizedTitle: {
        zh: '等候之中，如鷹展翅上騰',
        'zh-CN': '等候之中，如鹰展翅上腾',
      },
      historicalBackground: [
        'Isaiah 40 marks a dramatic turning point in the book, opening words of consolation for an exhausted community longing for home after decades of exile.',
      ],
      theologicalContext: [
        'The Hebrew word for "renew" (chalaph) literally means "to exchange." Those who wait on God do not merely squeeze harder on depleted willpower; they exchange human exhaustion for divine endurance.',
      ],
      practicalApplication: [
        'Notice the progression at the end of verse 31: soaring, running, and finally walking without fainting. Sometimes the greatest miracle is steady faithfulness in ordinary walking.',
      ],
      reflectionPrayer:
        'Everlasting Creator, exchange my weariness for your steady strength today, whether I am soaring, running, or simply walking one faithful step at a time. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '《以賽亞書》第四十章是全書重要的轉折點，向長年流亡異鄉、身心俱疲的百姓發出溫柔的安慰。',
          theologicalContext:
            '第三十一節「從新得力」的希伯來原文含有「交換」之意：等候耶和華的人，不是靠自己榨乾剩餘的意志力，而是用人的有限疲乏，交換創造主永不枯竭的能力。',
          practicalApplication:
            '留意經文最後的順序：先是展翅上騰，接著奔跑不困倦，最後是行走不疲乏。在平凡日子裡穩健地邁出每一步，往往正是神蹟所在。',
          reflectionPrayer:
            '永在的創造主，求祢以祢穩定的力量交換我的疲乏，無論今天需要展翅、奔跑，或是踏實行走，都賜我夠用的恩典。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '《以赛亚书》第四十章是全书重要的转折点，向长年流亡异乡、身心俱疲的百姓发出温柔的安慰。',
          theologicalContext:
            '第三十一节「从新得力」的希伯来原文含有「交换」之意：等候耶和华的人，不是靠自己榨干剩余的意志力，而是用人的有限疲乏，交换创造主永不枯竭的能力。',
          practicalApplication:
            '留意经文最后的顺序：先是展翅上腾，接着奔跑不困倦，最后是行走不疲乏。在平凡日子里稳健地迈出每一步，往往正是神迹所在。',
          reflectionPrayer:
            '永在的创造主，求你以你稳定的力量交换我的疲乏，无论今天需要展翅、奔跑，或是踏实行走，都赐我够用的恩典。阿们。',
        },
      },
    },
    lyrics: {
      title: 'Wait Upon the Lord',
      tempoNote: 'Steady anthem · 70 BPM · A Major',
      verse1: [
        'Youth grows faint and kingdoms fade,',
        'Seasons turn like autumn grass,',
        'Yet Your word remains unchanged,',
        'Holding fast when shadows pass.',
      ],
      chorus: [
        'Those who wait upon the Lord',
        'Will exchange their strength anew,',
        'Rising up on eagles’ wings,',
        'Walking steady, walking true.',
      ],
      verse2: [
        'You who measure every star',
        'Never slumber, never tire,',
        'Pouring courage in the weak,',
        'Kindling hope with gentle fire.',
      ],
      bridge: [
        'Walk and not grow faint,',
        'Run and keep the pace,',
        'Carried by Your grace.',
      ],
      localized: {
        zh: {
          title: '等候耶和華必從新得力',
          tempoNote: '沉穩聖詩 · 70 BPM · A大調',
          verse1: ['少年也會疲乏困倦，', '花草隨著季節凋殘，', '惟有祢的話語永遠立定，', '在黑影掠過時依然堅固。'],
          chorus: ['凡等候耶和華的人，', '必從新得著剛強力量；', '如大鷹展翅乘風上騰，', '行走在正路永不疲乏。'],
          verse2: ['數算星宿的創造主啊，', '祢不打盹也不曾困倦，', '將勇氣澆灌在軟弱裡面，', '點亮心中不熄的盼望。'],
          bridge: ['行走不疲乏，奔跑不困倦，', '每一步都有祢恩典托住。'],
        },
        'zh-CN': {
          title: '等候耶和华必从新得力',
          tempoNote: '沉稳圣诗 · 70 BPM · A大调',
          verse1: ['少年也会疲乏困倦，', '花草随着季节凋残，', '惟有你的话语永远立定，', '在黑影掠过时依然坚固。'],
          chorus: ['凡等候耶和华的人，', '必从新得着刚强力量；', '如大鹰展翅乘风上腾，', '行走在正路永不疲乏。'],
          verse2: ['数算星宿的创造主啊，', '你不打盹也不曾困倦，', '将勇气浇灌在软弱里面，', '点亮心中不熄的盼望。'],
          bridge: ['行走不疲乏，奔跑不困倦，', '每一步都有你恩典托住。'],
        },
      },
    },
  },
  {
    key: 'psalm_91',
    bookSlug: 'psalm',
    chapter: 91,
    title: 'Shelter Under the Wings of the Most High',
    topics: ['protection', 'comfort', 'anxiety', 'fear', 'refuge', 'peace', 'night', '避難所', '避难所'],
    verses: {
      en: [
        { verse: 1, text: 'He who dwells in the secret place of the Most High will rest in the shadow of the Almighty.' },
        { verse: 2, text: 'I will say of Yahweh, “He is my refuge and my fortress; my God, in whom I trust.”' },
        { verse: 4, text: 'He will cover you with his feathers. Under his wings you will take refuge. His faithfulness is your shield and rampart.' },
        { verse: 5, text: 'You shall not be afraid of the terror by night, nor of the arrow that flies by day;' },
        { verse: 11, text: 'For he will put his angels in charge of you, to guard you in all your ways.' },
      ],
      zh: [
        { verse: 1, text: '住在至高者隱密處的，必住在全能者的蔭下。' },
        { verse: 2, text: '我要論到耶和華說：他是我的避難所，是我的山寨，是我的神，是我所倚靠的。' },
        { verse: 4, text: '他必用自己的翎毛遮蔽你；你要投靠在他的翅膀底下；他的誠實是大小的盾牌。' },
        { verse: 5, text: '你必不怕黑夜的驚駭，或是白日飛的箭，' },
        { verse: 11, text: '因他要為你吩咐他的使者，在你行的一切道路上保護你。' },
      ],
      'zh-CN': [
        { verse: 1, text: '住在至高者隐密处的，必住在全能者的荫下。' },
        { verse: 2, text: '我要论到耶和华说：他是我的避难所，是我的山寨，是我的神，是我所倚靠的。' },
        { verse: 4, text: '他必用自己的翎毛遮蔽你；你要投靠在他的翅膀底下；他的诚实是大小的盾牌。' },
        { verse: 5, text: '你必不怕黑夜的惊骇，或是白日飞的箭，' },
        { verse: 11, text: '因他要为你吩咐他的使者，在你行的一切道路上保护你。' },
      ],
    },
    devotionalCore: {
      title: 'Dwelling in the Secret Shelter',
      localizedTitle: {
        zh: '全能者翅膀蔭下的避難所',
        'zh-CN': '全能者翅膀荫下的避难所',
      },
      historicalBackground: [
        'Psalm 91 combines architectural images of a fortified citadel with the tender shelter of a mother bird’s outstretched wings.',
      ],
      theologicalContext: [
        'Safety in the Psalms begins with "dwelling" (yashav)—remaining close to God before crisis strikes, rather than visiting only in emergencies.',
      ],
      practicalApplication: [
        'Before sleep tonight, speak verse 2 aloud as a quiet boundary against fear: "You are my refuge and my fortress."',
      ],
      reflectionPrayer:
        'Most High God, cover my household tonight beneath your faithful wings and quiet every anxious alarm. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '《詩篇》第九十一篇將堅固的山寨堡壘與母鳥張開翅膀庇護雛鳥的溫柔意象交織在一起，成為歷代信徒夜間祈禱的詩歌。',
          theologicalContext:
            '第一節的「住」在希伯來文中指長久安居，而非危機發生時才匆忙造訪。真正的平安始於平日就住在至高者的同在裡。',
          practicalApplication:
            '今晚睡前，輕聲誦讀第二節：「祢是我的避難所，我的山寨」，讓這句宣告成為抵擋恐懼的平靜界線。',
          reflectionPrayer:
            '至高的神，今晚求祢用信實的翎毛遮蔽我的家人，平息一切夜間的驚慌與掛慮。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '《诗篇》第九十一篇将坚固的山寨堡垒与母鸟张开翅膀庇护雏鸟的温柔意象交织在一起，成为历代信徒夜间祈祷的诗歌。',
          theologicalContext:
            '第一节的「住」在希伯来文中指长久安居，而非危机发生时才匆忙造访。真正的平安始于平日就住在至高者的同在里。',
          practicalApplication:
            '今晚睡前，轻声诵读第二节：「你是我的避难所，我的山寨」，让这句宣告成为抵挡恐惧的平静界线。',
          reflectionPrayer:
            '至高的神，今晚求你用信实的翎毛遮蔽我的家人，平息一切夜间的惊慌与挂虑。阿们。',
        },
      },
    },
    lyrics: {
      title: 'Shadow of the Almighty',
      tempoNote: 'Lullaby hymn · 64 BPM · E Major',
      verse1: [
        'In the secret quiet place,',
        'Safe beneath the evening sky,',
        'Shadows turn to sheltered rest',
        'In the presence of Most High.',
      ],
      chorus: [
        'My refuge and my fortress,',
        'My shield through day and night;',
        'Beneath Your faithful feathers',
        'My spirit finds its light.',
      ],
      verse2: [
        'Arrows pass and rumors fade,',
        'Fear loosens its heavy hold;',
        'Every step is watched and kept',
        'In the mercies You have told.',
      ],
      bridge: [
        'I will rest, I will trust,',
        'You are faithful, You are just.',
      ],
      localized: {
        zh: {
          title: '全能者的蔭下',
          tempoNote: '晚禱搖籃曲 · 64 BPM · E大調',
          verse1: ['在至高者隱密安靜處，', '夜空星光輕輕垂落，', '黑影化作安息的帳幕，', '有祢同在就不必驚慌。'],
          chorus: ['祢是我的避難所與山寨，', '白晝黑夜作我的盾牌；', '投靠在祢信實翅膀底下，', '我的靈魂得著安穩光亮。'],
          verse2: ['流言與暗箭漸漸消散，', '恐懼鬆開緊握的雙手；', '每一步都有使者看顧，', '安穩走在祢應許當中。'],
          bridge: ['我願安息，我願信靠，', '祢的誠實永不動搖。'],
        },
        'zh-CN': {
          title: '全能者的荫下',
          tempoNote: '晚祷摇篮曲 · 64 BPM · E大调',
          verse1: ['在至高者隐密安静处，', '夜空星光轻轻垂落，', '黑影化作安息的帐幕，', '有你同在就不必惊慌。'],
          chorus: ['你是我的避难所与山寨，', '白昼黑夜作我的盾牌；', '投靠在你信实翅膀底下，', '我的灵魂得着安稳光亮。'],
          verse2: ['流言与暗箭渐渐消散，', '恐惧松开紧握的双手；', '每一步都有使者看顾，', '安稳走在你应许当中。'],
          bridge: ['我愿安息，我愿信靠，', '你的诚实永不动摇。'],
        },
      },
    },
  },
  {
    key: 'proverbs_3',
    bookSlug: 'proverbs',
    chapter: 3,
    title: 'Trusting Without Leaning on Your Own Sight',
    topics: ['wisdom', 'guidance', 'trust', 'strength', 'peace', 'decisions', '智慧', '引導'],
    verses: {
      en: [
        { verse: 1, text: 'My son, don’t forget my teaching, but let your heart keep my commandments;' },
        { verse: 3, text: 'Don’t let kindness and truth forsake you. Bind them around your neck. Write them on the tablet of your heart.' },
        { verse: 5, text: 'Trust in Yahweh with all your heart, and don’t lean on your own understanding.' },
        { verse: 6, text: 'In all your ways acknowledge him, and he will make your paths straight.' },
      ],
      zh: [
        { verse: 1, text: '我兒，不要忘記我的法則；你心要謹守我的誡命；' },
        { verse: 3, text: '不可使慈愛、誠實離開你，要繫在你頸項上，刻在你心版上。' },
        { verse: 5, text: '你要專心仰賴耶和華，不可倚靠自己的聰明，' },
        { verse: 6, text: '在你一切所行的事上都要認定他，他必指引你的路。' },
      ],
      'zh-CN': [
        { verse: 1, text: '我儿，不要忘记我的法则；你心要谨守我的诫命；' },
        { verse: 3, text: '不可使慈爱、诚实离开你，要系在你颈项上，刻在你心版上。' },
        { verse: 5, text: '你要专心仰赖耶和华，不可倚靠自己的聪明，' },
        { verse: 6, text: '在你一切所行的事上都要认定他，他必指引你的路。' },
      ],
    },
    devotionalCore: {
      title: 'Straight Paths Born of Surrendered Trust',
      localizedTitle: {
        zh: '專心仰賴，祂必指引你的路',
        'zh-CN': '专心仰赖，他必指引你的路',
      },
      historicalBackground: [
        'Proverbs 3 forms part of a wisdom father-to-child instruction urging lifelong steadiness of character over quick cleverness.',
      ],
      theologicalContext: [
        'To "acknowledge" God (yada) means intimate relational awareness—inviting God into everyday work, finances, and friendships rather than reserving faith for Sundays.',
      ],
      practicalApplication: [
        'Identify one decision where you are over-relying on anxious self-calculation, and consciously entrust the outcome to God’s guidance.',
      ],
      reflectionPrayer:
        'Source of wisdom, keep kindness and truth bound close to my heart and straighten the steps ahead of me today. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '《箴言》第三章是一段充滿溫情的智慧訓誨，教導人一生持守慈愛與誠實，勝過急功近利的小聰明。',
          theologicalContext:
            '第六節「認定他」在希伯來原文中意指深切相交的認識——邀請神進入日常的工作、財務與人際抉擇中，而不只是停留在禮拜天的敬拜。',
          practicalApplication:
            '找出今天一件讓你過度焦慮盤算的決定，有意識地把它交託給神的引導。',
          reflectionPrayer:
            '智慧的源頭，求祢使慈愛與誠實常刻在我心版上，並在今日修直我前面的道路。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '《箴言》第三章是一段充满温情的智慧训诲，教导人一生持守慈爱与诚实，胜过急功近利的小聪明。',
          theologicalContext:
            '第六节「认定他」在希伯来原文中意指深切相交的认识——邀请神进入日常的工作、财务与人际抉择中，而不只是停留在礼拜天的敬拜。',
          practicalApplication:
            '找出今天一件让你过度焦虑盘算的决定，有意识地把它交托给神的引导。',
          reflectionPrayer:
            '智慧的源头，求你使慈爱与诚实常刻在我心版上，并在今日修直我前面的道路。阿们。',
        },
      },
    },
    lyrics: {
      title: 'Acknowledge Him in Every Way',
      tempoNote: 'Acoustic reflection · 78 BPM · C Major',
      verse1: [
        'Bind mercy close around my neck,',
        'Write truth upon this earthen heart,',
        'And keep my feet from hurried pride',
        'Before my busy plans depart.',
      ],
      chorus: [
        'With all my heart I trust in You,',
        'Not leaning on my narrow sight;',
        'In every road I look to You',
        'To make my crooked pathways right.',
      ],
      verse2: [
        'No clever map can see the bend,',
        'No hurried hand can force the dawn,',
        'Yet wisdom meets the humble soul',
        'To carry steady courage on.',
      ],
      bridge: [
        'Step by step, day by day,',
        'Walk beside me all the way.',
      ],
      localized: {
        zh: {
          title: '在一切事上認定祢',
          tempoNote: '清晨默想 · 78 BPM · C大調',
          verse1: ['將慈愛緊緊繫在頸項，', '把誠實刻在我的心版，', '保守我遠離急躁驕傲，', '在靜默裡學會等待。'],
          chorus: ['我要專心仰賴耶和華，', '不倚靠自己有限眼光；', '在所行每條路上認定祢，', '祢必指引前方明亮方向。'],
          verse2: ['再精密的圖表看不見轉彎，', '再急切的雙手催促不了天明，', '惟有謙卑信靠的靈魂，', '得著安穩前行的勇氣。'],
          bridge: ['一步一步，一天一天，', '主啊與我同行到永遠。'],
        },
        'zh-CN': {
          title: '在一切事上认定你',
          tempoNote: '清晨默想 · 78 BPM · C大调',
          verse1: ['将慈爱紧紧系在颈项，', '把诚实刻在我的心版，', '保守我远离急躁骄傲，', '在静默里学会等待。'],
          chorus: ['我要专心仰赖耶和华，', '不倚靠自己有限眼光；', '在所行每条路上认定你，', '你必指引前方明亮方向。'],
          verse2: ['再精密的图表看不见转弯，', '再急切的双手催促不了天明，', '惟有谦卑信靠的灵魂，', '得着安稳前行的勇气。'],
          bridge: ['一步一步，一天一天，', '主啊与我同行到永远。'],
        },
      },
    },
  },
  {
    key: 'matthew_5',
    bookSlug: 'matthew',
    chapter: 5,
    title: 'Blessed Are the Gentle, Pure & Peacemakers',
    topics: ['blessing', 'peace', 'mercy', 'humility', 'light', 'comfort', 'kingdom', '八福', '和平'],
    verses: {
      en: [
        { verse: 3, text: '“Blessed are the poor in spirit, for theirs is the Kingdom of Heaven.”' },
        { verse: 4, text: '“Blessed are those who mourn, for they shall be comforted.”' },
        { verse: 5, text: '“Blessed are the gentle, for they shall inherit the earth.”' },
        { verse: 7, text: '“Blessed are the merciful, for they shall obtain mercy.”' },
        { verse: 8, text: '“Blessed are the pure in heart, for they shall see God.”' },
        { verse: 9, text: '“Blessed are the peacemakers, for they shall be called children of God.”' },
        { verse: 14, text: '“You are the light of the world. A city located on a hill can’t be hidden.”' },
      ],
      zh: [
        { verse: 3, text: '「虛心的人有福了！因為天國是他們的。」' },
        { verse: 4, text: '「哀慟的人有福了！因為他們必得安慰。」' },
        { verse: 5, text: '「溫柔的人有福了！因為他們必承受地土。」' },
        { verse: 7, text: '「憐恤人的人有福了！因為他們必蒙憐恤。」' },
        { verse: 8, text: '「清心的人有福了！因為他們必得見神。」' },
        { verse: 9, text: '「使人和睦的人有福了！因為他們必稱為神的兒子。」' },
        { verse: 14, text: '「你們是世上的光。城造在山上是不能隱藏的。」' },
      ],
      'zh-CN': [
        { verse: 3, text: '「虚心的人有福了！因为天国是他们的。」' },
        { verse: 4, text: '「哀恸的人有福了！因为他们必得安慰。」' },
        { verse: 5, text: '「温柔的人有福了！因为他们必承受地土。」' },
        { verse: 7, text: '「怜恤人的人有福了！因为他们必蒙怜恤。」' },
        { verse: 8, text: '「清心的人有福了！因为他们必得见神。」' },
        { verse: 9, text: '「使人和睦的人有福了！因为他们必称为神的儿子。」' },
        { verse: 14, text: '「你们是世上的光。城造在山上是不能隐藏的。」' },
      ],
    },
    devotionalCore: {
      title: 'The Upside-Down Blessings of the Hillside',
      localizedTitle: {
        zh: '加利利山坡上的八福祝福',
        'zh-CN': '加利利山坡上的八福祝福',
      },
      historicalBackground: [
        'Delivered on a Galilean hillside overlooking the Sea of Galilee, the Sermon on the Mount opens by reversing every worldly metric of privilege.',
      ],
      theologicalContext: [
        'The Beatitudes are declarations of grace before they are demands: Jesus blesses the grieving, the meek, and the hungry for justice precisely where they stand.',
      ],
      practicalApplication: [
        'Look for one place today where you can act as a quiet peacemaker—lowering tension rather than escalating it.',
      ],
      reflectionPrayer:
        'Jesus, teacher on the hillside, form gentleness, mercy, and peacemaking courage within my spirit today. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '耶穌在俯瞰加利利海的山坡上頒布《登山寶訓》，開篇的「八福」徹底翻轉了世人衡量成功與尊貴的標準。',
          theologicalContext:
            '八福首先是恩典的宣告，而不只是道德要求：耶穌在哀慟者、溫柔者與飢渴慕義者所在之處，便向他們宣告天國的福分已經臨到。',
          practicalApplication:
            '今天在家庭或工作場合中，尋找一個機會作安靜的「使人和睦者」——柔和地降低緊張，而不是火上加油。',
          reflectionPrayer:
            '在山坡上教導的主耶穌，求祢今天在我靈裡塑造溫柔、憐恤與締造和平的勇氣。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '耶稣在俯瞰加利利海的山坡上颁布《登山宝训》，开篇的「八福」彻底翻转了世人衡量成功与尊贵的标准。',
          theologicalContext:
            '八福首先是恩典的宣告，而不只是道德要求：耶稣在哀恸者、温柔者与饥渴慕义者所在之处，便向他们宣告天国的福分已经临到。',
          practicalApplication:
            '今天在家庭或工作场合中，寻找一个机会作安静的「使人和睦者」——柔和地降低紧张，而不是火上加油。',
          reflectionPrayer:
            '在山坡上教导的主耶稣，求你今天在我灵里塑造温柔、怜恤与缔造和平的勇气。阿们。',
        },
      },
    },
    lyrics: {
      title: 'City on a Hill',
      tempoNote: 'Warm choir · 74 BPM · G Major',
      verse1: [
        'Upon the quiet Galilean slope,',
        'You spoke a blessing to the poor,',
        'And promised comfort to the tears',
        'That lingered heavy at the door.',
      ],
      chorus: [
        'Blessed are the merciful,',
        'Blessed are the meek,',
        'Peacemakers who carry light',
        'To every soul they meet.',
      ],
      verse2: [
        'No lamp is lit to hide beneath,',
        'No mercy wasted in the dark;',
        'A quiet kindness shines afar',
        'And wakes a weary neighbor’s spark.',
      ],
      bridge: [
        'Pure in heart, let us see,',
        'Walking in humility.',
      ],
      localized: {
        zh: {
          title: '山上的光城',
          tempoNote: '聖詩合唱 · 74 BPM · G大調',
          verse1: ['在加利利寧靜的山坡上，', '祢向心裡虛心的人賜福，', '應許安慰每一滴哀慟眼淚，', '使絕望的心重新看見路。'],
          chorus: ['憐恤人的人有福了，', '溫柔的人有福了；', '使人和睦的兒女們，', '把光帶到每個角落。'],
          verse2: ['沒有燈點亮只為藏在斗底，', '沒有愛浪費在沉默黑夜，', '一句柔和恩慈的回應，', '就能點亮鄰舍心中的火。'],
          bridge: ['清心的人必得見神，', '謙卑同行在祢光中。'],
        },
        'zh-CN': {
          title: '山上的光城',
          tempoNote: '圣诗合唱 · 74 BPM · G大调',
          verse1: ['在加利利宁静的山坡上，', '你向心里虚心的人赐福，', '应许安慰每一滴哀恸眼泪，', '使绝望的心重新看见路。'],
          chorus: ['怜恤人的人有福了，', '温柔的人有福了；', '使人和睦的儿女们，', '把光带到每个角落。'],
          verse2: ['没有灯点亮只为藏在斗底，', '没有爱浪费在沉默黑夜，', '一句柔和恩慈的回应，', '就能点亮邻舍心中的火。'],
          bridge: ['清心的人必得见神，', '谦卑同行在你光中。'],
        },
      },
    },
  },
  {
    key: 'romans_8',
    bookSlug: 'romans',
    chapter: 8,
    title: 'Nothing Can Separate Us From Love',
    topics: ['hope', 'love', 'comfort', 'anxiety', 'victory', 'spirit', 'grace', 'assurance', '盼望', '慈愛'],
    verses: {
      en: [
        { verse: 1, text: 'There is therefore now no condemnation to those who are in Christ Jesus.' },
        { verse: 26, text: 'In the same way, the Spirit also helps our weaknesses, for we don’t know how to pray as we ought. But the Spirit himself makes intercession for us with groanings which can’t be uttered.' },
        { verse: 28, text: 'We know that all things work together for good for those who love God, for those who are called according to his purpose.' },
        { verse: 31, text: 'What then shall we say about these things? If God is for us, who can be against us?' },
        { verse: 38, text: 'For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers,' },
        { verse: 39, text: 'nor height, nor depth, nor any other created thing will be able to separate us from God’s love which is in Christ Jesus our Lord.' },
      ],
      zh: [
        { verse: 1, text: '如今，那些在基督耶穌裡的就不定罪了。' },
        { verse: 26, text: '況且，我們的軟弱有聖靈幫助；我們本不曉得當怎樣禱告，只是聖靈親自用說不出來的歎息替我們禱告。' },
        { verse: 28, text: '我們曉得萬事都互相效力，叫愛神的人得益處，就是按他旨意被召的人。' },
        { verse: 31, text: '既是這樣，還有甚麼說的呢？神若幫助我們，誰能敵擋我們呢？' },
        { verse: 38, text: '因為我深信無論是死，是生，是天使，是掌權的，是有能的，是現在的事，是將來的事，' },
        { verse: 39, text: '是高處的，是低處的，是別的受造之物，都不能叫我們與神的愛隔絕；這愛是在我們的主基督耶穌裡的。' },
      ],
      'zh-CN': [
        { verse: 1, text: '如今，那些在基督耶稣里的就不定罪了。' },
        { verse: 26, text: '况且，我们的软弱有圣灵帮助；我们本不晓得当怎样祷告，只是圣灵亲自用说不出来的叹息替我们祷告。' },
        { verse: 28, text: '我们晓得万事都互相效力，叫爱神的人得益处，就是按他旨意被召的人。' },
        { verse: 31, text: '既是这样，还有什么说的呢？神若帮助我们，谁能敌挡我们呢？' },
        { verse: 38, text: '因为我深信无论是死，是生，是天使，是掌权的，是有能的，是现在的事，是将来的事，' },
        { verse: 39, text: '是高处的，是低处的，是别的受造之物，都不能叫我们与神的爱隔绝；这爱是在我们的主基督耶稣里的。' },
      ],
    },
    devotionalCore: {
      title: 'Unbreakable Love When Words Run Out',
      localizedTitle: {
        zh: '無法隔絕的愛：在無語時的代禱',
        'zh-CN': '无法隔绝的爱：在无语时的代祷',
      },
      historicalBackground: [
        'Written to house churches in Rome facing social suspicion and fragile unity, Romans 8 serves as the soaring crescendo of Paul’s epistle.',
      ],
      theologicalContext: [
        'From "no condemnation" in verse 1 to "no separation" in verse 39, the chapter frames the believer’s life inside unshakeable divine advocacy.',
      ],
      practicalApplication: [
        'When you feel too drained to form eloquent prayers, lean on verse 26: the Spirit translates even wordless sighs.',
      ],
      reflectionPrayer:
        'God who is for us, anchor me in the certainty that neither height, nor depth, nor tomorrow’s unknowns can separate me from your love. Amen.',
      localizedSummary: {
        zh: {
          historicalBackground:
            '保羅寫信給在羅馬面對社會誤解與聚會壓力的家庭教會，《羅馬書》第八章正是全卷書信最壯闊的盼望樂章。',
          theologicalContext:
            '從第一節的「不再定罪」，一路推向第三十九節的「不能隔絕」，整章經文將信徒的人生安放在神永不搖動的慈愛守護之內。',
          practicalApplication:
            '當你疲憊到連禱告的話都說不出來時，請安息在第二十六節的應許：聖靈會親自把我們說不出的嘆息化作代求。',
          reflectionPrayer:
            '幫助我們的神，求祢將我的心牢牢錨定在祢的愛裡，深信無論高處、低處或未知的明天，都不能叫我與基督的愛隔絕。阿們。',
        },
        'zh-CN': {
          historicalBackground:
            '保罗写信给在罗马面对社会误解与聚会压力的家庭教会，《罗马书》第八章正是全卷书信最壮阔的盼望乐章。',
          theologicalContext:
            '从第一节的「不再定罪」，一路推向第三十九节的「不能隔绝」，整章经文将信徒的人生安放在神永不摇动的慈爱守护之内。',
          practicalApplication:
            '当你疲惫到连祷告的话都说不出来时，请安息在第二十六节的应许：圣灵会亲自把我们说不出的叹息化作代求。',
          reflectionPrayer:
            '帮助我们的神，求你将我的心牢牢锚定在你的爱里，深信无论高处、低处或未知的明天，都不能叫我与基督的爱隔绝。阿们。',
        },
      },
    },
    lyrics: {
      title: 'No Separation',
      tempoNote: 'Reverent ballad · 72 BPM · E-flat Major',
      verse1: [
        'When prayer dissolves to wordless sighs,',
        'Too tired to shape a proper plea,',
        'Your Spirit intercedes within',
        'And speaks the grace I cannot see.',
      ],
      chorus: [
        'Neither height nor deepest sea,',
        'Present trial or days to be,',
        'Nothing built by time or space',
        'Separates us from Your grace.',
      ],
      verse2: [
        'No condemnation marks the door,',
        'No shadow holds the final word;',
        'The One who gave His very Son',
        'Has kept the promise we have heard.',
      ],
      bridge: [
        'If God is for us, hope holds fast;',
        'Love outlives the storm at last.',
      ],
      localized: {
        zh: {
          title: '不能隔絕的愛',
          tempoNote: '敬拜抒情曲 · 72 BPM · 降E大調',
          verse1: ['當禱告化作無聲的嘆息，', '疲憊到不知該如何開口，', '聖靈在深處親自替我代求，', '說出我看見卻說不出的恩典。'],
          chorus: ['無論高處或深處，', '現在的事或將來的事，', '沒有任何受造之物，', '能叫我們與神的愛隔絕。'],
          verse2: ['不再有定罪留在門前，', '陰霾不再擁有最後的話語；', '那位連愛子都捨了的主，', '必照應許保守我們到底。'],
          bridge: ['神若幫助我們，盼望就堅定，', '祂的愛終必勝過一切風浪。'],
        },
        'zh-CN': {
          title: '不能隔绝的爱',
          tempoNote: '敬拜抒情曲 · 72 BPM · 降E大调',
          verse1: ['当祷告化作无声的叹息，', '疲惫到不知该如何开口，', '圣灵在深处亲自替我代求，', '说出我看见却说不出的恩典。'],
          chorus: ['无论高处或深处，', '现在的事或将来的事，', '没有任何受造之物，', '能叫我们与神的爱隔绝。'],
          verse2: ['不再有定罪留在门前，', '阴霾不再拥有最后的话语；', '那位连爱子都舍了的主，', '必照应许保守我们到底。'],
          bridge: ['神若帮助我们，盼望就坚定，', '他的爱终必胜过一切风浪。'],
        },
      },
    },
  },
];

export function buildDevotionalVariants(entry: SeededChapterData, lang: SupportedLang): Record<string, DevotionalVariant> {
  const core = entry.devotionalCore;
  const loc = core.localizedSummary?.[lang];
  const title = core.localizedTitle?.[lang] ?? core.title;

  const fullHist = loc ? loc.historicalBackground : core.historicalBackground.join('\n\n');
  const fullTheo = loc ? loc.theologicalContext : core.theologicalContext.join('\n\n');
  const fullApp = loc ? loc.practicalApplication : core.practicalApplication.join('\n\n');
  const prayer = loc ? loc.reflectionPrayer : core.reflectionPrayer;

  const lengths: DevotionalLength[] = [1, 3, 5, 10, 15];
  const variants: Record<string, DevotionalVariant> = {};

  for (const len of lengths) {
    if (len === 1) {
      variants['1'] = {
        length: 1,
        title,
        estimatedMinutes: 1,
        historicalBackground: loc ? loc.historicalBackground : core.historicalBackground[0],
        theologicalContext: loc ? loc.theologicalContext : core.theologicalContext[0],
        practicalApplication: loc ? loc.practicalApplication : core.practicalApplication[0],
        reflectionPrayer: prayer,
      };
    } else if (len === 3) {
      variants['3'] = {
        length: 3,
        title,
        estimatedMinutes: 3,
        historicalBackground: loc ? loc.historicalBackground : core.historicalBackground.slice(0, 2).join('\n\n'),
        theologicalContext: loc ? loc.theologicalContext : core.theologicalContext.slice(0, 2).join('\n\n'),
        practicalApplication: loc ? loc.practicalApplication : core.practicalApplication.slice(0, 2).join('\n\n'),
        reflectionPrayer: prayer,
      };
    } else if (len === 5) {
      variants['5'] = {
        length: 5,
        title,
        estimatedMinutes: 5,
        historicalBackground: fullHist,
        theologicalContext: fullTheo,
        practicalApplication: fullApp,
        reflectionPrayer: prayer,
      };
    } else if (len === 10) {
      variants['10'] = {
        length: 10,
        title,
        estimatedMinutes: 10,
        historicalBackground: loc
          ? fullHist
          : `${fullHist}\n\nReading this passage within its canonical setting highlights how carefully the biblical editors preserved poetic structure and historical memory for communities enduring change.`,
        theologicalContext: loc
          ? fullTheo
          : `${fullTheo}\n\nAcross both Old and New Testaments, this motif recurs as a thread of covenant faithfulness—inviting readers to trace how promise and fulfillment echo across generations.`,
        practicalApplication: loc
          ? fullApp
          : `${fullApp}\n\nTake three unhurried minutes with a notebook to copy one verse from this chapter by hand and observe which single word lingers in your attention.`,
        reflectionPrayer: prayer,
      };
    } else {
      variants['15'] = {
        length: 15,
        title,
        estimatedMinutes: 15,
        historicalBackground: loc
          ? fullHist
          : `${fullHist}\n\nReading this passage within its canonical setting highlights how carefully the biblical editors preserved poetic structure and historical memory for communities enduring change. Ancient listeners encountered scripture primarily through communal recitation aloud rather than silent skimming, allowing cadence and repetition to settle deeply in memory.`,
        theologicalContext: loc
          ? fullTheo
          : `${fullTheo}\n\nAcross both Old and New Testaments, this motif recurs as a thread of covenant faithfulness—inviting readers to trace how promise and fulfillment echo across generations. Notice how divine initiative consistently precedes human obedience: grace establishes the ground on which faithfulness walks.`,
        practicalApplication: loc
          ? fullApp
          : `${fullApp}\n\nTake three unhurried minutes with a notebook to copy one verse from this chapter by hand and observe which single word lingers in your attention. Consider sharing that verse with a friend or family member today as an encouragement, and return to it at dusk to review how God met you in the ordinary hours.`,
        reflectionPrayer: prayer,
      };
    }
  }

  return variants;
}
