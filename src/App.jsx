import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient, isSupabaseConfigured } from './lib/supabase.js'

const WHATSAPP_NUMBER = '38971942295'
const MKD_PER_EUR = 61.5
const euroPriceFromDenars = amount => Math.round((amount / MKD_PER_EUR) * 100) / 100
const languageNames = { mk: 'МК', sq: 'AL', en: 'EN' }
const themes = [
  { id: 'lilac', color: '#b9a5ff' },
  { id: 'blue', color: '#8dbbff' },
  { id: 'mint', color: '#8fe3c0' },
  { id: 'cyan', color: '#00f0ff' },
]
const themeTranslations = {
  mk: { theme: 'БОЈА НА ТЕМАТА', themeLilac: 'Лилакова', themeBlue: 'Светло сина', themeMint: 'Нане', themeCyan: 'Тиркизна' },
  sq: { theme: 'NGJYRA E TEMËS', themeLilac: 'Lejla', themeBlue: 'Blu e çelët', themeMint: 'Nenexhik', themeCyan: 'Cian' },
  en: { theme: 'THEME COLOR', themeLilac: 'Lilac', themeBlue: 'Soft blue', themeMint: 'Mint', themeCyan: 'Cyan' },
}
const communityTranslations = {
  mk: {
    communityEyebrow: '06 / ЗАЕДНИЦАТА НА SPECTRA',
    communityTitle: 'НАШИТЕ ВОЗАЧИ.',
    communityAccent: 'ВАШИТЕ МАШИНИ.',
    communityIntro: 'Покажи го својот мотор или проект. Пријави се, испрати фотографија и неколку зборови — објавите ги проверуваме пред да се појават во галеријата.',
    communityEmail: 'Е-ПОШТА',
    communityPassword: 'ЛОЗИНКА',
    communityLogin: 'НАЈАВИ СЕ',
    communityCreateAccount: 'КРЕИРАЈ ПРОФИЛ',
    communityNeedAccount: 'Немаш профил?',
    communityHaveAccount: 'Веќе имаш профил?',
    communityLogout: 'ОДЈАВИ СЕ',
    communityLoginTitle: 'ПРИДРУЖИ СЕ НА ЕКИПАТА',
    communityLoginIntro: 'Најави се или креирај профил за да го испратиш својот проект.',
    communitySubmitTitle: 'СПОДЕЛИ ГО СВОЈОТ ПРОЕКТ',
    communityDisplayName: 'ИМЕ ЗА ОБЈАВА',
    communityDisplayPlaceholder: 'Како да те потпишеме?',
    communityVehicle: 'МОТОР / ВОЗИЛО',
    communityVehiclePlaceholder: 'Марка и модел, на пр. Aprilia SR 50',
    communityStory: 'ПРИКАЗНА ЗА ПРОЕКТОТ',
    communityStoryPlaceholder: 'Кажи ни нешто за моторот, измените или приказната зад него.',
    communityInstagram: 'INSTAGRAM (НЕЗАДОЛЖИТЕЛНО)',
    communityInstagramPlaceholder: '@твој.профил',
    communityPhoto: 'ФОТОГРАФИЈА',
    communityPhotoHelp: 'JPEG, PNG или WebP · до 8 MB',
    communityConsent: 'Се согласувам фотографијата и овие податоци да бидат јавно прикажани ако Spectracustoms ја одобри објавата. Мојата е-пошта нема да биде прикажана.',
    communitySubmit: 'ИСПРАТИ ЗА ОДОБРУВАЊЕ',
    communityGalleryTitle: 'ОД НАШАТА ЕКИПА',
    communityPendingTitle: 'ЧЕКААТ ОДОБРУВАЊЕ',
    communityPending: 'ЧЕКА ОДОБРУВАЊЕ',
    communityApprove: 'ОДОБРИ',
    communityReject: 'ОДБИЈ',
    communityEmpty: 'Галеријата допрва се полни. Биди меѓу првите што ќе го споделат својот мотор.',
    communityLoading: 'СЕ ВЧИТУВА ГАЛЕРИЈАТА…',
    communityNotConfigured: 'Галеријата и најавата сè уште не се поврзани. Администраторот треба да ги додаде Supabase податоците за поврзување.',
    communityConfirmEmail: 'Провери ја е-поштата и потврди ја сметката пред да се најавиш.',
    communitySubmissionSuccess: 'Фотографијата е испратена. Ќе се појави во галеријата откако ќе биде одобрена.',
    communityPhotoError: 'Избери JPEG, PNG или WebP фотографија со големина до 8 MB.',
    communityErrorPrefix: 'Не успеа:',
    communitySubmitted: 'ИСПРАТЕНО',
    communityYourSubmissions: 'ТВОИ ОБЈАВИ',
  },
  sq: {
    communityEyebrow: '06 / KOMUNITETI SPECTRA',
    communityTitle: 'RIDER-AT TANË.',
    communityAccent: 'MOTORËT TUAJ.',
    communityIntro: 'Trego motoçikletën ose projektin tënd. Regjistrohu, dërgo një fotografi dhe disa fjalë — çdo postim kontrollohet para se të shfaqet në galeri.',
    communityEmail: 'EMAIL',
    communityPassword: 'FJALËKALIMI',
    communityLogin: 'HYR',
    communityCreateAccount: 'KRIJO LLOGARI',
    communityNeedAccount: 'Nuk ke llogari?',
    communityHaveAccount: 'Ke tashmë llogari?',
    communityLogout: 'DIL',
    communityLoginTitle: 'BASHKOHU ME EKIPIN',
    communityLoginIntro: 'Hyr ose krijo llogari për të dërguar projektin tënd.',
    communitySubmitTitle: 'NDARJE E PROJEKTIT TËND',
    communityDisplayName: 'EMRI PËR PUBLIKIM',
    communityDisplayPlaceholder: 'Si të të shënojmë?',
    communityVehicle: 'MOTOÇIKLETA / AUTOMJETI',
    communityVehiclePlaceholder: 'Marka dhe modeli, p.sh. Aprilia SR 50',
    communityStory: 'HISTORIA E PROJEKTIT',
    communityStoryPlaceholder: 'Na trego për motoçikletën, modifikimet ose historinë e saj.',
    communityInstagram: 'INSTAGRAM (OPSIONALE)',
    communityInstagramPlaceholder: '@profili.yt',
    communityPhoto: 'FOTOGRAFIA',
    communityPhotoHelp: 'JPEG, PNG ose WebP · deri në 8 MB',
    communityConsent: 'Pajtohem që fotografia dhe këto të dhëna të shfaqen publikisht nëse Spectracustoms e miraton postimin. Email-i im nuk do të shfaqet.',
    communitySubmit: 'DËRGO PËR MIRATIM',
    communityGalleryTitle: 'NGA KOMUNITETI YNË',
    communityPendingTitle: 'NË PRITJE TË MIRATIMIT',
    communityPending: 'NË PRITJE',
    communityApprove: 'MIRATO',
    communityReject: 'REFUZO',
    communityEmpty: 'Galeria sapo ka filluar. Bëhu ndër të parët që ndan motoçikletën tënde.',
    communityLoading: 'DUKE NGARKUAR GALERINË…',
    communityNotConfigured: 'Galeria dhe hyrja ende nuk janë lidhur. Administratori duhet të shtojë të dhënat e lidhjes me Supabase.',
    communityConfirmEmail: 'Kontrollo email-in dhe konfirmo llogarinë para se të hysh.',
    communitySubmissionSuccess: 'Fotografia u dërgua. Do të shfaqet në galeri pasi të miratohet.',
    communityPhotoError: 'Zgjidh një fotografi JPEG, PNG ose WebP deri në 8 MB.',
    communityErrorPrefix: 'Dështoi:',
    communitySubmitted: 'U DËRGUA',
    communityYourSubmissions: 'POSTIMET E TUA',
  },
  en: {
    communityEyebrow: '06 / THE SPECTRA COMMUNITY',
    communityTitle: 'OUR RIDERS.',
    communityAccent: 'YOUR BUILDS.',
    communityIntro: 'Show off your bike or build. Sign up, send a photo and a few words — we review every post before it appears in the gallery.',
    communityEmail: 'EMAIL',
    communityPassword: 'PASSWORD',
    communityLogin: 'SIGN IN',
    communityCreateAccount: 'CREATE ACCOUNT',
    communityNeedAccount: 'New here?',
    communityHaveAccount: 'Already have an account?',
    communityLogout: 'SIGN OUT',
    communityLoginTitle: 'JOIN THE CREW',
    communityLoginIntro: 'Sign in or create an account to send in your build.',
    communitySubmitTitle: 'SHARE YOUR BUILD',
    communityDisplayName: 'DISPLAY NAME',
    communityDisplayPlaceholder: 'What should we call you?',
    communityVehicle: 'BIKE / VEHICLE',
    communityVehiclePlaceholder: 'Make and model, e.g. Aprilia SR 50',
    communityStory: 'YOUR BUILD STORY',
    communityStoryPlaceholder: 'Tell us about the bike, the mods or the story behind it.',
    communityInstagram: 'INSTAGRAM (OPTIONAL)',
    communityInstagramPlaceholder: '@your.handle',
    communityPhoto: 'PHOTO',
    communityPhotoHelp: 'JPEG, PNG or WebP · up to 8 MB',
    communityConsent: 'I agree that this photo and these details may be shown publicly if Spectracustoms approves the post. My email will not be displayed.',
    communitySubmit: 'SEND FOR APPROVAL',
    communityGalleryTitle: 'FROM THE CREW',
    communityPendingTitle: 'AWAITING APPROVAL',
    communityPending: 'PENDING APPROVAL',
    communityApprove: 'APPROVE',
    communityReject: 'REJECT',
    communityEmpty: 'The gallery is just getting started. Be one of the first to share your bike.',
    communityLoading: 'LOADING THE GALLERY…',
    communityNotConfigured: 'The gallery and sign-in are not connected yet. The site administrator needs to add the Supabase connection details.',
    communityConfirmEmail: 'Check your email and confirm your account before signing in.',
    communitySubmissionSuccess: 'Your photo is submitted. It will appear in the gallery once approved.',
    communityPhotoError: 'Choose a JPEG, PNG or WebP photo up to 8 MB.',
    communityErrorPrefix: 'Could not complete:',
    communitySubmitted: 'SUBMITTED',
    communityYourSubmissions: 'YOUR POSTS',
  },
}
const imageUrl = (image, options) => image.startsWith('/images/')
  ? `${import.meta.env.BASE_URL}${image.slice(1)}`
  : `https://images.unsplash.com/${image}?${options}`
const translations = {
  mk: {
    documentTitle: 'Spectracustoms — Фарбање, декали и облека по мерка', metaDescription: 'Spectracustoms — професионално фарбање мотори и автомобили, персонализирани декали и премиум облека. Цени во евра и денари.',
    navHome: 'Почетна', navServices: 'Услуги', navShop: 'Налепници', navMerch: 'Облека', navWork: 'Проекти', navCommunity: 'Заедница', navContact: 'Контакт', quoteCta: 'Побарај понуда', cart: 'Кошничка', menu: 'Отвори мени', closeMenu: 'Затвори мени', language: 'ЈАЗИК', currency: 'ВАЛУТА',
    heroEyebrow: 'НЕЗАВИСНО КАСТОМ СТУДИО', heroTitle: 'ТВОЈАТА МАШИНА', heroTitleAccent: 'ЗАСЛУЖУВА СОВРШЕНСТВО.', heroDescription: 'Професионално фарбање на мотори и коли, врвни графички фолии и персонализирана облека за сите кои не се задоволуваат со просечност.', heroShop: 'Истражи ги налепниците', heroQuote: 'Побарај понуда', heroFact1: 'СОЗДАДЕНО ЗА ТВОЈОТ МОТОР', heroFact2: 'РАЧНА ИЗРАБОТКА. НИКАДЕ ПРОСЕЧНО.', heroCaption: 'ТВОЈОТ МОТОР. ТВОЈ СТИЛ.', scroll: 'ИСТРАЖИ',
    ticker1: 'РАЧНА ИЗРАБОТКА', ticker2: 'ПРОФЕСИОНАЛНО ФАРБАЊЕ', ticker3: 'ПРЕЦИЗНИ ДЕКАЛИ', ticker4: 'БЕЗ ПРОСЕЧНОСТ',
    servicesEyebrow: '01 / СТУДИОТО', servicesTitle: 'ДОБАР ВКУС.', servicesAccent: 'СВОИ ПРАВИЛА.', servicesIntro: 'Од промена на боја до целосен нов идентитет. Внимаваме на секој детаљ за твојата машина да биде незаборавна.', servicePaint: 'Фарбање мотори и коли', servicePaintDesc: 'Твојата визија, преточена во беспрекорна завршница.', paintTag1: 'Металик и еднобојно фарбање', paintTag2: 'Хамелеон / flip ефект', paintTag3: 'Аерографија и поправка', serviceDecals: 'Персонализирани декали', serviceDecalsDesc: 'Графика што прецизно одговара на твојата машина.', decalTag1: 'Векторски дизајн по мерка', decalTag2: 'Комплети за цела каросерија', decalTag3: 'Прецизни фолии и ливреи', serviceApparel: 'Персонализирана облека', serviceApparelDesc: 'Тешки материјали. Чист дизајн. Твој личен печат.', apparelTag1: 'Маици, дуксери и блузи', apparelTag2: 'Печатење по мерка', apparelTag3: 'Мали серии и уникати', startProject: 'СОЗДАЈ ГО ТВОЈОТ ПРОЕКТ',
    trustMantra: 'РАЧНО ИЗРАБОТЕНО ЗА ВОЗАЧИ КОИ НИКОГАШ НЕ ВОЗАТ СЕРИСКИ.', trustLabel: 'НАШ ПРИСТАП / 01', trustText: 'Од првата скица до последниот слој го градиме проектот заедно — со јасен договор, прецизна изработка и потврда пред секој важен чекор.', trustFoot: 'ОД ИДЕЈА ДО ФИНАЛНА ИЗРАБОТКА', directChat: 'ПИШИ НИ ДИРЕКТНО',
    spotlightEyebrow: 'ВИСТИНСКИ ПРОЕКТ / КУМАНОВО', spotlightTitle: 'ТВОЈОТ СТИЛ.', spotlightAccent: 'ТВОЈ ПОТПИС.', spotlightDescription: 'Ова е еден од нашите проекти. Кажи ни што возиш и каков изглед замислуваш — ќе разговараме за идејата и следните чекори.', spotlightPoint1: 'Персонализирани декали и ливреи', spotlightPoint2: 'Фарбање и поправка на пластики', spotlightPoint3: 'Понуда според твојот проект', spotlightWhatsapp: 'РАЗГОВАРАЈ ЗА ТВОЈОТ ПРОЕКТ', spotlightWhatsAppMessage: 'Здраво Spectracustoms! Видов го вашиот Spectra Rally проект и сакам да прашам за мој проект.', spotlightGallery: 'ВИДИ ГИ ПРОЕКТИТЕ', spotlightImageAlt: 'Автомобил Spectra Rally со персонализирана ливреја, фотографиран во Куманово',
    shopEyebrow: '02 / ПРОДАВНИЦА ЗА НАЛЕПНИЦИ', shopTitle: 'ТРКАЧКИ КОРЕНИ.', shopAccent: 'СПРЕМНИ ЗА ПАТ.', shopDescription: 'Официјални тјунинг брендови. Квалитетни материјали. Избери финиш и најди го својот стил.', all: 'Сите', performance: 'Перформанси', racing: 'Тркање', spectra: 'Спектра', search: 'Пребарај бренд', filterProducts: 'Филтрирај производи', stickerSet: 'СЕТ НАЛЕПНИЦИ', finish: 'ФИНИШ', size: 'ГОЛЕМИНА', add: 'ДОДАЈ ВО КОШНИЧКА', noProducts: 'Нема налепници. Обиди се со друго пребарување.', showing: 'ПРИКАЖАНИ', sets: 'СЕТОВИ', customAsk: 'ТРЕБАШ НЕШТО ПО МЕРКА?', finishGloss: 'Сјајна', finishMatte: 'Мат', finishChrome: 'Хром', finishHolo: 'Холографска', finishReflective: 'Рефлектирачка', racingSeries: 'ТРКАЧКА СЕРИЈА',
    merchEyebrow: '03 / СПЕКТРА КОЛЕКЦИЈА', merchTitle: 'СПЕКТРА ОБЛЕКА', merchAccent: 'И ОПРЕМА.', merchDescription: 'За часовите пред возење и приказните потоа. Тешки материјали, чист дизајн, без компромиси.', studioUniform: 'СТУДИСКА УНИФОРМА / ТОМ 01', madeToOrder: '3 МОДЕЛИ · ПЕРСОНАЛИЗИРАНИ ПО НАРАЧКА', merchTee: 'Премиум маица', teeDesc: 'Тешка памучна маица · 280 g/m²', teeCategory: 'МАИЦА / 280 G/M²', merchHoodie: 'Брендиран дуксер', hoodieDesc: 'Топол дуксер со капуљача и кенгур џеб', hoodieCategory: 'ДУКСЕР / 480 G/M²', merchCrew: 'Премиум блуза', crewDesc: 'Минималистичка блуза без капуљача', crewCategory: 'БЛУЗА / 420 G/M²', personalize: 'ТВОЈ ТЕКСТ / ПРЕКАР', textPlaceholder: 'SPECTRA', placement: 'ПОЗИЦИЈА НА ПЕЧАТОТ', chest: 'Предно лого на градите', backPrint: 'Голем принт на грбот', sleeve: 'Детал на ракавот', color: 'БОЈА', matteBlack: 'Мат црна', carbonGrey: 'Јаглеродна сива', cyberWhite: 'Кибер бела', neon: 'Неонски акцент', addQuick: 'ДОДАЈ ВО КОШНИЧКА', merchEnd1: 'НАПРАВЕНО ЗА СЕКОЈДНЕВНО НОСЕЊЕ.', merchEnd2: 'ПЕРСОНАЛИЗИРАЈ ЈА. НАПРАВИ ЈА СВОЈА.',
    quoteEyebrow: '04 / ЗАПОЧНИ СО ПРОЕКТОТ', quoteTitle: 'АЈДЕ ДА ЈА', quoteAccent: 'СРЕДИМЕ.', quoteDescription: 'Избери услуга, возило и финиш. Добиј брза проценка во евра и денари пред да почнеме.', estimateNote: 'ПРОЦЕНКАТА Е ОРИЕНТАЦИСКА. КОНЕЧНАТА ЦЕНА ЈА ПОТВРДУВАМЕ ПРЕД ПОЧЕТОК.', calculator: 'КАЛКУЛАТОР ЗА ЦЕНА', service: 'УСЛУГА', vehicle: 'МОТОР / ВОЗИЛО', material: 'ФИНИШ / МАТЕРИЈАЛ', paint: 'Фарбање', decals: 'Персонализирани декали', motorcycle: 'Мотор', car: 'Автомобил', standardPaint: 'Стандардна боја', metallic: 'Металик', chameleon: 'Хамелеон', standardVinyl: 'Стандардна фолија', reflectiveVinyl: 'Рефлектирачка фолија', customGraphics: 'Прилагодена графика', estimatedRange: 'ПРОЦЕНЕТ ОПСЕГ', finalPriceNote: 'Конечната цена зависи од деталите на проектот.', requestWhatsApp: 'ПОБАРАЈ ПОНУДА ПРЕКУ WHATSAPP', requestEmail: 'ИЛИ ИСПРАТИ ГО БАРАЊЕТО ПО Е-ПОШТА', estimateSubject: 'Барање понуда — Spectracustoms', estimateMessage: 'Здраво Spectracustoms! Би сакал/а понуда за', for: 'на', withFinish: 'со финиш', estimateIs: 'Проценет опсег:',
    workEyebrow: '05 / ИЗБРАНИ ПРОЕКТИ', workTitle: 'ИЗРАБОТЕНО ТУКА.', workAccent: 'ПРЕПОЗНАТЛИВО СЕКАДЕ.', allWork: 'Сите проекти', paintJobs: 'Фарбање', decalJobs: 'Декали', apparelJobs: 'Облека', paintGallery: 'Целосно фарбање по мерка', decalGallery: 'Персонализирана ливреја', apparelGallery: 'Студиска колекција', galleryTitle: 'Изработено различно', galleryCarTitle: 'Spectra Rally / Corsa', galleryFairingsTitle: 'Тркачки сет / Aprilia', galleryStickerTitle: 'Декали по нарачка', galleryScooterTitle: 'Custom скутер / проект',
    contactEyebrow: '07 / ТВОЈ РЕД', contactTitle: 'ИМАШ ИДЕЈА', contactAccent: 'ЗА ПРОЕКТ?', contactDescription: 'Испрати ни ја идејата, фотографијата или скицата. Ние ќе се погрижиме за останатото.', whatsappUs: 'ПИШИ НИ НА WHATSAPP', yourName: 'ТВОЕТО ИМЕ', namePlaceholder: 'Име и презиме', phone: 'ТЕЛЕФОН / WHATSAPP', phonePlaceholder: '+389 ...', projectType: 'ЗА ШТО СЕ РАБОТИ?', projectMotor: 'Мотор / скутер', projectCar: 'Автомобил', projectDecals: 'Персонализирани декали', projectApparel: 'Маица / дуксер / блуза', projectOther: 'Друг проект', details: 'ДЕТАЛИ ЗА ПРОЕКТОТ', detailsPlaceholder: 'Опиши ни ја идејата. Колку повеќе детали, толку подобро.', referencePhoto: 'РЕФЕРЕНТНА ФОТОГРАФИЈА (НЕЗАДОЛЖИТЕЛНО)', attach: 'Додај фотографија или скица', submitProject: 'ИСПРАТИ ГО ПРОЕКТОТ', openWhatsApp: 'ОТВОРИ WHATSAPP ЗА ИСПРАЌАЊЕ', privacy: 'ТВОИТЕ ПОДАТОЦИ ОСТАНУВААТ КАЈ НАШЕТО СТУДИО.',
    footerText: 'Независно кастом студио.', footerSub: 'За машини со свој карактер.', backTop: 'НАЗАД НА ВРВ', footerMotto: 'СОЗДАДЕНО ЗА ПАТ.', footerServices: 'ФАРБАЊЕ / ДЕКАЛИ / ОБЛЕКА',
    footerContactTitle: 'КОНТАКТ / ЛОКАЦИЈА', footerPhone: 'ЈАВИ СЕ', footerLocation: 'ЛОКАЦИЈА', footerCity: 'Куманово, Северна Македонија', footerMapTitle: 'Zenix Zperformance — Google Maps', footerMapLink: 'ОТВОРИ ВО GOOGLE MAPS',
    yourSelection: 'ТВОЈ ИЗБОР', cartTitle: 'КОШНИЧКА', closeCart: 'Затвори кошничка', emptyCart: 'Кошничката е празна.', findStickers: 'ИЗБЕРИ НАЛЕПНИЦИ', customMark: 'ТЕКСТ:', total: 'ВКУПНО', shipping: 'Испораката се пресметува дополнително.', orderWhatsApp: 'НАРАЧАЈ ПРЕКУ WHATSAPP', orderMessage: 'Здраво Spectracustoms! Сакам да нарачам:', colorway: 'БОЈА', printPlacement: 'позиција:', orderText: 'текст:', subtotal: 'Вкупно:',
    performance: 'Перформанси', racing: 'Тркање', spectra: 'Спектра', productStage6: 'R/T тркачки комплет', productMalossi: 'Тимски сет налепници', productPolini: 'Evolution серија', product2fast: '2Fast For Race налепници', productDoppler: 'Doppler тјунинг сет', productSpectra: 'After Hours потписен сет',
  },
  sq: {
    documentTitle: 'Spectracustoms — Lyerje, ngjitëse dhe veshje me porosi', metaDescription: 'Spectracustoms — lyerje profesionale për motoçikleta dhe makina, ngjitëse të personalizuara dhe veshje premium. Çmime në euro dhe denarë.',
    navHome: 'Kryefaqja', navServices: 'Shërbimet', navShop: 'Ngjitëse', navMerch: 'Veshje', navWork: 'Projektet', navCommunity: 'Komuniteti', navContact: 'Kontakt', quoteCta: 'Kërko ofertë', cart: 'Shporta', menu: 'Hap menynë', closeMenu: 'Mbyll menynë', language: 'GJUHA', currency: 'MONEDHA',
    heroEyebrow: 'STUDIO E PAVARUR CUSTOM', heroTitle: 'MAKINA JOTE', heroTitleAccent: 'MERITON PËRSOSMËRI.', heroDescription: 'Lyerje profesionale për motoçikleta dhe makina, folje grafike cilësore dhe veshje të personalizuara për ata që nuk kënaqen me mesataren.', heroShop: 'Shiko ngjitëset', heroQuote: 'Kërko ofertë', heroFact1: 'KRIJUAR PËR MOTIN TËND', heroFact2: 'PUNUAR ME DORË. ASNJËHERË MESATARE.', heroCaption: 'MOTI YT. STILI YT.', scroll: 'EKSPLORO',
    ticker1: 'PUNUAR ME DORË', ticker2: 'LYERJE PROFESIONALE', ticker3: 'DETAJE TË SAKTA', ticker4: 'ASNJËHERË MESATARE',
    servicesEyebrow: '01 / STUDIOJA', servicesTitle: 'SHIJE E MIRË.', servicesAccent: 'RREGULLAT TONA.', servicesIntro: 'Nga ndryshimi i ngjyrës te një identitet i ri. Kujdesemi për çdo detaj që makina jote të mos harrohet.', servicePaint: 'Lyerje motoçikletash dhe makinash', servicePaintDesc: 'Vizioni yt, i kthyer në një përfundim të përsosur.', paintTag1: 'Ngjyra metalike dhe uniforme', paintTag2: 'Efekt kameleon / flip', paintTag3: 'Airbrush dhe riparim', serviceDecals: 'Ngjitëse të personalizuara', serviceDecalsDesc: 'Grafikë që përshtatet saktësisht me makinën tënde.', decalTag1: 'Dizajn vektorial sipas porosisë', decalTag2: 'Komplete për të gjithë karrocerinë', decalTag3: 'Folje dhe livery precize', serviceApparel: 'Veshje të personalizuara', serviceApparelDesc: 'Materiale të rënda. Dizajn i pastër. Shenja jote.', apparelTag1: 'Bluza, kapuça dhe sweatshirt', apparelTag2: 'Printim sipas porosisë', apparelTag3: 'Seri të vogla dhe unike', startProject: 'KRIJO PROJEKTIN TËND',
    trustMantra: 'PUNUAR ME DORË PËR RIDER-AT QË NUK NGASIN KURRË STOCK.', trustLabel: 'QASJA JONË / 01', trustText: 'Nga skica e parë te shtresa e fundit e ndërtojmë projektin bashkë — me marrëveshje të qartë, punim preciz dhe konfirmim në çdo hap të rëndësishëm.', trustFoot: 'NGA IDEJA TE PUNIMI FINAL', directChat: 'NA SHKRUAJ DIREKT',
    spotlightEyebrow: 'PROJEKT REAL / KUMANOVË', spotlightTitle: 'STILI YT.', spotlightAccent: 'NËNSHKRIMI YT.', spotlightDescription: 'Ky është një nga projektet tona. Na trego çfarë drejton dhe çfarë pamjeje ke në mendje — flasim për idenë dhe hapat e ardhshëm.', spotlightPoint1: 'Ngjitëse dhe livery të personalizuara', spotlightPoint2: 'Lyerje dhe riparim plastikash', spotlightPoint3: 'Ofertë sipas projektit tënd', spotlightWhatsapp: 'FLISIM PËR PROJEKTIN TËND', spotlightWhatsAppMessage: 'Përshëndetje Spectracustoms! Pashë projektin tuaj Spectra Rally dhe dua të pyes për projektin tim.', spotlightGallery: 'SHIKO PROJEKTET', spotlightImageAlt: 'Makina Spectra Rally me livery të personalizuar, fotografuar në Kumanovë',
    shopEyebrow: '02 / DYQANI I NGJITËSEVE', shopTitle: 'RRËNJË GARASH.', shopAccent: 'GATI PËR RRUGË.', shopDescription: 'Brende zyrtare tuning. Materiale cilësore. Zgjidh përfundimin dhe gjej stilin tënd.', all: 'Të gjitha', performance: 'Performancë', racing: 'Gara', spectra: 'Spectra', search: 'Kërko brendin', filterProducts: 'Filtro produktet', stickerSet: 'SET NGJITËSESH', finish: 'PËRFUNDIMI', size: 'MADHËSIA', add: 'SHTO NË SHPORTË', noProducts: 'Nuk u gjetën ngjitëse. Provo kërkim tjetër.', showing: 'DUKE SHFAQUR', sets: 'SETE', customAsk: 'TË DUHET DIÇKA SIPAS POROSISË?', finishGloss: 'Me shkëlqim', finishMatte: 'Mat', finishChrome: 'Krom', finishHolo: 'Holografik', finishReflective: 'Reflektues', racingSeries: 'SERI GARASH',
    merchEyebrow: '03 / KOLEKSIONI SPECTRA', merchTitle: 'VESHJE SPECTRA', merchAccent: 'DHE PAJISJE.', merchDescription: 'Për orët para vozitjes dhe tregimet pas saj. Materiale të rënda, dizajn i pastër, pa kompromise.', studioUniform: 'UNIFORMA E STUDIOS / VOL. 01', madeToOrder: '3 MODELE · PERSONALIZOHEN SIPAS POROSISË', merchTee: 'T-shirt premium', teeDesc: 'T-shirt pambuku i rëndë · 280 g/m²', teeCategory: 'T-SHIRT / 280 G/M²', merchHoodie: 'Hoodie i brenduar', hoodieDesc: 'Hoodie i ngrohtë me kapuç dhe xhep kangur', hoodieCategory: 'HOODIE / 480 G/M²', merchCrew: 'Sweatshirt premium', crewDesc: 'Sweatshirt minimalist pa kapuç', crewCategory: 'SWEATSHIRT / 420 G/M²', personalize: 'TEKSTI YT / Nofka', textPlaceholder: 'SPECTRA', placement: 'POZICIONI I PRINTIMIT', chest: 'Logo përpara në gjoks', backPrint: 'Print i madh në shpinë', sleeve: 'Detaj në mëngë', color: 'NGJYRA', matteBlack: 'E zezë mat', carbonGrey: 'Gri karboni', cyberWhite: 'E bardhë cyber', neon: 'Theks neoni', addQuick: 'SHTO NË SHPORTË', merchEnd1: 'KRIJUAR PËR PËRDORIM TË PËRDITSHËM.', merchEnd2: 'PERSONALIZOJE. BËJE TËNDEN.',
    quoteEyebrow: '04 / NIS PROJEKTIN', quoteTitle: 'LE TA', quoteAccent: 'RREGULLOJMË.', quoteDescription: 'Zgjidh shërbimin, automjetin dhe përfundimin. Merr një vlerësim të shpejtë në euro dhe denarë.', estimateNote: 'VLERËSIMI ËSHTË ORIENTUES. ÇMIMI FINAL KONFIRMOHET PARA FILLIMIT.', calculator: 'LLOGARITËSI I ÇMIMIT', service: 'SHËRBIMI', vehicle: 'MOTO / AUTOMJETI', material: 'PËRFUNDIMI / MATERIALI', paint: 'Lyerje', decals: 'Ngjitëse të personalizuara', motorcycle: 'Motoçikletë', car: 'Makinë', standardPaint: 'Ngjyrë standarde', metallic: 'Metalike', chameleon: 'Kameleon', standardVinyl: 'Folje standarde', reflectiveVinyl: 'Folje reflektuese', customGraphics: 'Grafikë e personalizuar', estimatedRange: 'VLERA E PËRAFËRT', finalPriceNote: 'Çmimi final varet nga detajet e projektit.', requestWhatsApp: 'KËRKO OFERTË NË WHATSAPP', requestEmail: 'OSE DËRGO KËRKESËN ME EMAIL', estimateSubject: 'Kërkesë për ofertë — Spectracustoms', estimateMessage: 'Përshëndetje Spectracustoms! Do të doja ofertë për', for: 'për', withFinish: 'me përfundim', estimateIs: 'Vlera e përafërt:',
    workEyebrow: '05 / PROJEKTET E ZGJEDHURA', workTitle: 'KRIJUAR KËTU.', workAccent: 'NJIhet KUDO.', allWork: 'Të gjitha', paintJobs: 'Lyerje', decalJobs: 'Ngjitëse', apparelJobs: 'Veshje', paintGallery: 'Lyerje e plotë me porosi', decalGallery: 'Livery e personalizuar', apparelGallery: 'Koleksioni i studios', galleryTitle: 'Ndryshe nga të tjerët', galleryCarTitle: 'Spectra Rally / Corsa', galleryFairingsTitle: 'Set garash / Aprilia', galleryStickerTitle: 'Ngjitëse me porosi', galleryScooterTitle: 'Skuter / projekt custom',
    contactEyebrow: '07 / RADHA JOTE', contactTitle: 'KE NJË IDE', contactAccent: 'PËR PROJEKT?', contactDescription: 'Na dërgo idenë, fotografinë ose skicën. Ne kujdesemi për pjesën tjetër.', whatsappUs: 'NA SHKRUAJ NË WHATSAPP', yourName: 'EMRI YT', namePlaceholder: 'Emri dhe mbiemri', phone: 'TELEFON / WHATSAPP', phonePlaceholder: '+389 ...', projectType: 'PËR ÇFARË BËHET FJALË?', projectMotor: 'Motoçikletë / skuter', projectCar: 'Makinë', projectDecals: 'Ngjitëse të personalizuara', projectApparel: 'T-shirt / hoodie / sweatshirt', projectOther: 'Projekt tjetër', details: 'DETAJET E PROJEKTIT', detailsPlaceholder: 'Na trego idenë. Sa më shumë detaje, aq më mirë.', referencePhoto: 'FOTOGRAFI REFERUESE (OPSIONALE)', attach: 'Shto fotografi ose skicë', submitProject: 'DËRGO PROJEKTIN', openWhatsApp: 'HAP WHATSAPP PËR TA DËRGUAR', privacy: 'TË DHËNAT TUAJA MBETEN NË STUDION TONË.',
    footerText: 'Studio e pavarur custom.', footerSub: 'Për makina me karakter.', backTop: 'KTHEHU LART ↑', footerMotto: 'KRIJUAR PËR RRUGË.', footerServices: 'LYERJE / NGJITËSE / VESHJE',
    footerContactTitle: 'KONTAKT / VENDNDODHJA', footerPhone: 'NA TELEFONO', footerLocation: 'VENDNDODHJA', footerCity: 'Kumanovë, Maqedonia e Veriut', footerMapTitle: 'Zenix Zperformance — Google Maps', footerMapLink: 'HAP NË GOOGLE MAPS',
    yourSelection: 'ZGJEDHJA JOTE', cartTitle: 'SHPORTA', closeCart: 'Mbyll shportën', emptyCart: 'Shporta është bosh.', findStickers: 'ZGJIDH NGJITËSE ↗', customMark: 'TEKSTI:', total: 'TOTALI', shipping: 'Transporti llogaritet veçmas.', orderWhatsApp: 'POROSIT NË WHATSAPP', orderMessage: 'Përshëndetje Spectracustoms! Dua të porosis:', colorway: 'NGJYRA', printPlacement: 'pozicioni:', orderText: 'teksti:', subtotal: 'Totali:',
    performance: 'Performancë', racing: 'Gara', spectra: 'Spectra', productStage6: 'Kompleti garash R/T', productMalossi: 'Set ngjitësesh i ekipit', productPolini: 'Seria Evolution', product2fast: 'Ngjitëse 2Fast For Race', productDoppler: 'Set tuning Doppler', productSpectra: 'Seti nënshkrues After Hours',
  },
  en: {
    documentTitle: 'Spectracustoms — Custom Paint, Decals & Apparel', metaDescription: 'Spectracustoms — professional motorcycle and car painting, custom decals and premium apparel. Prices in euros and denars.',
    navHome: 'Home', navServices: 'Services', navShop: 'Stickers', navMerch: 'Apparel', navWork: 'Work', navCommunity: 'Riders', navContact: 'Contact', quoteCta: 'Get a quote', cart: 'Cart', menu: 'Open menu', closeMenu: 'Close menu', language: 'LANGUAGE', currency: 'CURRENCY',
    heroEyebrow: 'INDEPENDENT CUSTOM STUDIO', heroTitle: 'YOUR MACHINE', heroTitleAccent: 'DESERVES PERFECTION.', heroDescription: 'Professional motorcycle and car paint, premium graphic decals, and custom apparel for people who refuse to settle for average.', heroShop: 'Explore sticker shop', heroQuote: 'Get a quote', heroFact1: 'BUILT FOR YOUR RIDE', heroFact2: 'MADE BY HAND. NEVER ORDINARY.', heroCaption: 'YOUR MACHINE. YOUR SIGNATURE.', scroll: 'EXPLORE',
    ticker1: 'MADE BY HAND', ticker2: 'PROFESSIONAL PAINT', ticker3: 'PRECISION DECALS', ticker4: 'NEVER ORDINARY',
    servicesEyebrow: '01 / THE STUDIO', servicesTitle: 'GOOD TASTE.', servicesAccent: 'OWN THE RULES.', servicesIntro: 'From a colour change to a complete new identity. Every detail matters when your machine needs to be unforgettable.', servicePaint: 'Motorcycle & car painting', servicePaintDesc: 'Your vision, finished to an uncompromising standard.', paintTag1: 'Metallic and solid paint', paintTag2: 'Chameleon / flip finish', paintTag3: 'Airbrush and fairing repair', serviceDecals: 'Custom decals & livery', serviceDecalsDesc: 'Graphics precision-fitted to your machine.', decalTag1: 'Custom vector design', decalTag2: 'Full body kits', decalTag3: 'Precision vinyl and livery', serviceApparel: 'Custom apparel', serviceApparelDesc: 'Heavy fabrics. Clean design. Your own signature.', apparelTag1: 'T-shirts, hoodies and crewnecks', apparelTag2: 'Made-to-order printing', apparelTag3: 'Small runs and one-offs', startProject: 'BUILD YOUR PROJECT',
    trustMantra: 'HAND-BUILT FOR RIDERS WHO NEVER RIDE STOCK.', trustLabel: 'OUR APPROACH / 01', trustText: 'From the first sketch to the final coat, we build the project together — with clear terms, precise craft, and approval at every important step.', trustFoot: 'FROM IDEA TO FINISHED WORK', directChat: 'TALK TO THE STUDIO',
    spotlightEyebrow: 'REAL PROJECT / KUMANOVO', spotlightTitle: 'YOUR STYLE.', spotlightAccent: 'YOUR SIGNATURE.', spotlightDescription: 'This is one of our projects. Tell us what you ride and the look you have in mind — we’ll talk through your idea and the next steps.', spotlightPoint1: 'Custom decals and livery', spotlightPoint2: 'Painting and plastic repair', spotlightPoint3: 'A quote shaped around your project', spotlightWhatsapp: 'TALK ABOUT YOUR PROJECT', spotlightWhatsAppMessage: 'Hi Spectracustoms! I saw your Spectra Rally project and would like to ask about my own project.', spotlightGallery: 'SEE MORE PROJECTS', spotlightImageAlt: 'Spectra Rally car with custom livery, photographed in Kumanovo',
    shopEyebrow: '02 / THE STICKER SHOP', shopTitle: 'RACE-BRED.', shopAccent: 'READY FOR THE ROAD.', shopDescription: 'Official tuning brands. Quality materials. Choose your finish and find your setup.', all: 'All', performance: 'Performance', racing: 'Racing', spectra: 'Spectra', search: 'Search brands', filterProducts: 'Filter products', stickerSet: 'DECAL SET', finish: 'FINISH', size: 'SIZE', add: 'ADD TO CART', noProducts: 'No decals found. Try another search.', showing: 'SHOWING', sets: 'DECAL SETS', customAsk: 'NEED SOMETHING CUSTOM?', finishGloss: 'Gloss', finishMatte: 'Matte', finishChrome: 'Chrome', finishHolo: 'Holographic', finishReflective: 'Reflective', racingSeries: 'RACING DIVISION',
    merchEyebrow: '03 / SPECTRA COLLECTION', merchTitle: 'SPECTRA APPAREL', merchAccent: '& GEAR.', merchDescription: 'For the hours before the ride and the stories after. Heavy fabrics, clean design, zero compromise.', studioUniform: 'STUDIO UNIFORM / VOL. 01', madeToOrder: '3 STYLES · PERSONALIZED TO ORDER', merchTee: 'Premium heavyweight tee', teeDesc: 'Heavyweight cotton tee · 280 g/m²', teeCategory: 'TEE / 280 G/M²', merchHoodie: 'Custom hooded sweatshirt', hoodieDesc: 'Warm hooded sweatshirt with kangaroo pocket', hoodieCategory: 'HOODIE / 480 G/M²', merchCrew: 'Premium crewneck sweatshirt', crewDesc: 'Minimal crewneck, no hood', crewCategory: 'CREWNECK / 420 G/M²', personalize: 'YOUR TEXT / NICKNAME', textPlaceholder: 'SPECTRA', placement: 'PRINT PLACEMENT', chest: 'Front chest logo', backPrint: 'Large back print', sleeve: 'Sleeve detail', color: 'COLORWAY', matteBlack: 'Matte Black', carbonGrey: 'Carbon Grey', cyberWhite: 'Cyber White', neon: 'Neon Accent', addQuick: 'ADD TO CART', merchEnd1: 'ENGINEERED FOR EVERYDAY WEAR.', merchEnd2: 'PERSONALIZE IT. MAKE IT YOURS.',
    quoteEyebrow: '04 / START YOUR BUILD', quoteTitle: 'LET’S MAKE', quoteAccent: 'IT YOURS.', quoteDescription: 'Choose a service, vehicle and finish. Get a quick estimate in euros and denars before we start.', estimateNote: 'ESTIMATE IS INDICATIVE. FINAL PRICE IS CONFIRMED BEFORE WORK BEGINS.', calculator: 'PRICE ESTIMATOR', service: 'SERVICE', vehicle: 'MOTORCYCLE / VEHICLE', material: 'FINISH / MATERIAL', paint: 'Painting', decals: 'Custom decals', motorcycle: 'Motorcycle', car: 'Car', standardPaint: 'Standard paint', metallic: 'Metallic', chameleon: 'Chameleon', standardVinyl: 'Standard vinyl', reflectiveVinyl: 'Reflective vinyl', customGraphics: 'Custom graphics', estimatedRange: 'ESTIMATED RANGE', finalPriceNote: 'Final price depends on project details.', requestWhatsApp: 'REQUEST A WHATSAPP QUOTE', requestEmail: 'OR SEND YOUR REQUEST BY EMAIL', estimateSubject: 'Custom quote — Spectracustoms', estimateMessage: 'Hi Spectracustoms! I’d like a quote for', for: 'for', withFinish: 'with', estimateIs: 'Estimated range:',
    workEyebrow: '05 / SELECTED PROJECTS', workTitle: 'BUILT RIGHT HERE.', workAccent: 'RECOGNIZED EVERYWHERE.', allWork: 'All projects', paintJobs: 'Painting', decalJobs: 'Decals', apparelJobs: 'Apparel', paintGallery: 'Full custom paint', decalGallery: 'Custom livery', apparelGallery: 'Studio collection', galleryTitle: 'Built different', galleryCarTitle: 'Spectra Rally / Corsa', galleryFairingsTitle: 'Race kit / Aprilia', galleryStickerTitle: 'Custom decals', galleryScooterTitle: 'Custom scooter / build',
    contactEyebrow: '07 / YOUR MOVE', contactTitle: 'HAVE AN IDEA', contactAccent: 'FOR A BUILD?', contactDescription: 'Send the idea, photo or sketch. We’ll take it from there.', whatsappUs: 'MESSAGE US ON WHATSAPP', yourName: 'YOUR NAME', namePlaceholder: 'First and last name', phone: 'PHONE / WHATSAPP', phonePlaceholder: '+389 ...', projectType: 'WHAT ARE WE WORKING ON?', projectMotor: 'Motorcycle / scooter', projectCar: 'Car', projectDecals: 'Custom decals', projectApparel: 'T-shirt / hoodie / crewneck', projectOther: 'Other project', details: 'PROJECT DETAILS', detailsPlaceholder: 'Tell us what you have in mind. More detail helps.', referencePhoto: 'REFERENCE IMAGE (OPTIONAL)', attach: 'Attach a photo or sketch', submitProject: 'SEND YOUR PROJECT', openWhatsApp: 'OPEN WHATSAPP TO SEND', privacy: 'YOUR DETAILS STAY WITH OUR STUDIO.',
    footerText: 'Independent custom studio.', footerSub: 'For machines with character.', backTop: 'BACK TO TOP ↑', footerMotto: 'BUILT FOR THE ROAD.', footerServices: 'PAINT / DECALS / APPAREL',
    footerContactTitle: 'CONTACT / LOCATION', footerPhone: 'CALL US', footerLocation: 'LOCATION', footerCity: 'Kumanovo, North Macedonia', footerMapTitle: 'Zenix Zperformance — Google Maps', footerMapLink: 'OPEN IN GOOGLE MAPS',
    yourSelection: 'YOUR SELECTION', cartTitle: 'YOUR CART', closeCart: 'Close cart', emptyCart: 'Your cart is empty.', findStickers: 'EXPLORE DECALS ↗', customMark: 'TEXT:', total: 'TOTAL', shipping: 'Shipping is calculated separately.', orderWhatsApp: 'ORDER VIA WHATSAPP', orderMessage: 'Hi Spectracustoms! I’d like to order:', colorway: 'COLOR', printPlacement: 'placement:', orderText: 'text:', subtotal: 'Total:',
    performance: 'Performance', racing: 'Racing', spectra: 'Spectra', productStage6: 'R/T Racing Logo Pack', productMalossi: 'Team Malossi Decal Set', productPolini: 'Evolution Series Kit', product2fast: '2Fast For Race Sticker', productDoppler: 'Doppler Tuning Kit', productSpectra: 'After Hours Signature Pack',
  },
}

const configuratorCopy = {
  mk: {
    chooseService: 'ИЗБЕРИ ШТО ТИ ТРЕБА',
    paintOption: 'Фарбање',
    customStickersOption: 'Custom налепници',
    makeShirtOption: 'Изработка на маици',
    vehicleKindLabel: 'ТИП НА ВОЗИЛО',
    repairPlastics: 'Поправка на пластики',
    projectType: 'ТИП НА ВОЗИЛО',
    motorcycle: 'Мотор',
    car: 'Автомобил',
    motorType: 'ТИП НА МОТОР',
    scooter: 'Скутер',
    sportbike: 'Спортски мотор',
    largeBike: 'Поголем мотор / крузер',
    otherBike: 'Друго',
    otherVehicle: 'Опиши го возилото',
    vehiclePlaceholder: 'Марка и модел',
    paintFinish: 'ФИНИШ НА БОЈАТА',
    paintColor: 'ИЗБЕРИ БОЈА',
    paintSpectrum: 'СПЕКТАР НА БОИ',
    colorCatalog: 'КАТАЛОГ НА БОИ',
    customColor: 'Избери сопствена боја',
    repairType: 'ШТО ТРЕБА ДА СЕ ПОПРАВИ?',
    smallCrack: 'Пукнатина на пластика',
    brokenMount: 'Скршен држач / носач',
    scratches: 'Гребнатини и оштетена површина',
    multipleDamage: 'Повеќе оштетувања',
    stickerStudio: 'СТУДИО ЗА CUSTOM НАЛЕПНИЦИ',
    openDesigner: 'ОТВОРИ ГО ДИЗАЈНЕРОТ',
    closeDesigner: 'ЗАТВОРИ ГО ДИЗАЈНЕРОТ',
    stickerText: 'ТЕКСТ НА НАЛЕПНИЦАТА',
    stickerPlaceholder: 'ВНЕСИ ТЕКСТ',
    stickerShape: 'ОБЛИК',
    stickerRectangle: 'Правоаголник',
    stickerCircle: 'Круг',
    stickerOutline: 'Контурен исечок',
    stickerSize: 'ГОЛЕМИНА',
    stickerSmall: 'Мала · 5 cm',
    stickerMedium: 'Средна · 10 cm',
    stickerLarge: 'Голема · 20 cm',
    stickerFullMotor: 'Комплет налепници за цел мотор',
    stickerQuantity: 'БРОЈ НА НАЛЕПНИЦИ',
    stickerFinish: 'МАТЕРИЈАЛ / ФИНИШ',
    stickerPreview: 'ПРЕГЛЕД НА ДИЗАЈНОТ',
    apparelType: 'ШТО ДА ИЗРАБОТИМЕ?',
    tee: 'Премиум маица',
    hoodie: 'Дуксер со капуљача',
    crewneck: 'Блуза без капуљача',
    units: 'КОЛИЧИНА',
    customRequest: 'ДОДАТНИ ДЕТАЛИ (ИЗБОРНО)',
    customPlaceholder: 'Кажи ни што треба да знаеме за проектот...',
    quoteIncludes: 'Избрана услуга и детали ќе бидат вклучени во барањето.',
    vehicleMotorcycle: 'Мотор',
    vehicleCar: 'Автомобил',
    serviceRepairOption: 'Поправка на пластики',
    serviceRepairTitle: 'Поправка на пластики',
    serviceRepairDesc: 'Поправуваме и обновуваме оштетени пластики без целосно фарбање.',
    repairTag1: 'Пукнатини и гребнатини',
    repairTag2: 'Држачи и носачи',
    repairTag3: 'Подготовка и финиш',
    colorIce: 'Ледено бела',
    colorRaceRed: 'Тркачка црвена',
    colorElectricBlue: 'Електрично сина',
    colorDeepPurple: 'Темно виолетова',
    colorAcidGreen: 'Ласер зелена',
    colorGraphite: 'Графитна',
    colorGold: 'Металик златна',
  },
  sq: {
    chooseService: 'ZGJIDH SHËRBIMIN',
    paintOption: 'Lyerje',
    customStickersOption: 'Ngjitëse custom',
    makeShirtOption: 'Prodhim bluzash',
    vehicleKindLabel: 'LLOJI I AUTOMJETIT',
    repairPlastics: 'Riparim i plastikës',
    projectType: 'LLOJI I AUTOMJETIT',
    motorcycle: 'Motoçikletë',
    car: 'Makinë',
    motorType: 'LLOJI I MOTOS',
    scooter: 'Skuter',
    sportbike: 'Moto sportive',
    largeBike: 'Moto e madhe / cruiser',
    otherBike: 'Tjetër',
    otherVehicle: 'Përshkruaj automjetin',
    vehiclePlaceholder: 'Marka dhe modeli',
    paintFinish: 'PËRFUNDIMI I BOJËS',
    paintColor: 'ZGJIDH NGJYRËN',
    paintSpectrum: 'SPEKTRI I NGJYRAVE',
    colorCatalog: 'KATALOGU I NGJYRAVE',
    customColor: 'Zgjidh ngjyrë të personalizuar',
    repairType: 'ÇFARË DUHET RIPARUAR?',
    smallCrack: 'Plasaritje në plastikë',
    brokenMount: 'Mbajtëse e thyer',
    scratches: 'Gërvishtje dhe sipërfaqe e dëmtuar',
    multipleDamage: 'Dëmtime të shumta',
    stickerStudio: 'STUDIO PËR NGJITËSE CUSTOM',
    openDesigner: 'HAP DIZAJNERIN',
    closeDesigner: 'MBYLL DIZAJNERIN',
    stickerText: 'TEKSTI I NGJITËSËS',
    stickerPlaceholder: 'SHKRUAJ TEKSTIN',
    stickerShape: 'FORMA',
    stickerRectangle: 'Drejtkëndësh',
    stickerCircle: 'Rreth',
    stickerOutline: 'Prerje konturi',
    stickerSize: 'MADHËSIA',
    stickerSmall: 'E vogël · 5 cm',
    stickerMedium: 'Mesatare · 10 cm',
    stickerLarge: 'E madhe · 20 cm',
    stickerFullMotor: 'Komplet ngjitësesh për të gjithë motorin',
    stickerQuantity: 'SASIA E NGJITËSEVE',
    stickerFinish: 'MATERIALI / PËRFUNDIMI',
    stickerPreview: 'PARAPAMJE E DIZAJNIT',
    apparelType: 'ÇFARË TË PRODHOJMË?',
    tee: 'Bluzë premium',
    hoodie: 'Duks me kapuç',
    crewneck: 'Bluzë pa kapuç',
    units: 'SASIA',
    customRequest: 'DETAJE SHTESË (OPSIONALE)',
    customPlaceholder: 'Na trego çfarë duhet të dimë për projektin...',
    quoteIncludes: 'Shërbimi dhe detajet e zgjedhura përfshihen në kërkesë.',
    vehicleMotorcycle: 'Motoçikletë',
    vehicleCar: 'Makinë',
    serviceRepairOption: 'Riparim i plastikës',
    serviceRepairTitle: 'Riparim i plastikës',
    serviceRepairDesc: 'Riparojmë dhe rinovojmë plastikën e dëmtuar pa lyerje të plotë.',
    repairTag1: 'Plasaritje dhe gërvishtje',
    repairTag2: 'Mbajtëse dhe kapëse',
    repairTag3: 'Përgatitje dhe përfundim',
    colorIce: 'E bardhë akull',
    colorRaceRed: 'E kuqe garash',
    colorElectricBlue: 'Blu elektrike',
    colorDeepPurple: 'Vjollcë e errët',
    colorAcidGreen: 'Jeshile laser',
    colorGraphite: 'Grafit',
    colorGold: 'Ari metalik',
  },
  en: {
    chooseService: 'CHOOSE YOUR SERVICE',
    paintOption: 'Painting',
    customStickersOption: 'Custom stickers',
    makeShirtOption: 'Custom apparel',
    vehicleKindLabel: 'VEHICLE TYPE',
    repairPlastics: 'Plastic repair',
    projectType: 'VEHICLE TYPE',
    motorcycle: 'Motorcycle',
    car: 'Car',
    motorType: 'MOTORCYCLE TYPE',
    scooter: 'Scooter',
    sportbike: 'Sportbike',
    largeBike: 'Large bike / cruiser',
    otherBike: 'Other',
    otherVehicle: 'Describe your vehicle',
    vehiclePlaceholder: 'Make and model',
    paintFinish: 'PAINT FINISH',
    paintColor: 'CHOOSE A COLOR',
    paintSpectrum: 'COLOR SPECTRUM',
    colorCatalog: 'COLOR CATALOG',
    customColor: 'Choose a custom color',
    repairType: 'WHAT NEEDS REPAIR?',
    smallCrack: 'Plastic crack',
    brokenMount: 'Broken tab / mount',
    scratches: 'Scratches and surface damage',
    multipleDamage: 'Multiple damaged areas',
    stickerStudio: 'CUSTOM STICKER STUDIO',
    openDesigner: 'OPEN THE DESIGNER',
    closeDesigner: 'CLOSE THE DESIGNER',
    stickerText: 'STICKER TEXT',
    stickerPlaceholder: 'ENTER YOUR TEXT',
    stickerShape: 'SHAPE',
    stickerRectangle: 'Rectangle',
    stickerCircle: 'Circle',
    stickerOutline: 'Contour cut',
    stickerSize: 'SIZE',
    stickerSmall: 'Small · 5 cm',
    stickerMedium: 'Medium · 10 cm',
    stickerLarge: 'Large · 20 cm',
    stickerFullMotor: 'Full motorcycle sticker kit',
    stickerQuantity: 'STICKER QUANTITY',
    stickerFinish: 'MATERIAL / FINISH',
    stickerPreview: 'DESIGN PREVIEW',
    apparelType: 'WHAT SHOULD WE MAKE?',
    tee: 'Premium T-shirt',
    hoodie: 'Hoodie',
    crewneck: 'Crewneck sweatshirt',
    units: 'QUANTITY',
    customRequest: 'EXTRA DETAILS (OPTIONAL)',
    customPlaceholder: 'Tell us anything else about your project...',
    quoteIncludes: 'Your selected service and details will be included in the request.',
    vehicleMotorcycle: 'Motorcycle',
    vehicleCar: 'Car',
    serviceRepairOption: 'Plastic repair',
    serviceRepairTitle: 'Plastic repair',
    serviceRepairDesc: 'Repair and restore damaged plastics without a full repaint.',
    repairTag1: 'Cracks and scratches',
    repairTag2: 'Tabs and mounts',
    repairTag3: 'Preparation and finish',
    colorIce: 'Ice white',
    colorRaceRed: 'Racing red',
    colorElectricBlue: 'Electric blue',
    colorDeepPurple: 'Deep purple',
    colorAcidGreen: 'Laser green',
    colorGraphite: 'Graphite',
    colorGold: 'Metallic gold',
  },
}

const products = [
  { id: 'stage6', brand: 'STAGE6', nameKey: 'productStage6', category: 'performance', price: 10, image: '/images/stickers-stage6.png', tone: 'orange' },
  { id: 'malossi', brand: 'MALOSSI', nameKey: 'productMalossi', category: 'performance', price: 13, image: '/images/stickers-malossi.png', tone: 'red' },
  { id: 'polini', brand: 'POLINI', nameKey: 'productPolini', category: 'performance', price: 12, image: '/images/stickers-polini.png', tone: 'blue' },
  { id: '2fast', brand: '2FAST', nameKey: 'product2fast', category: 'racing', price: 9, image: '/images/stickers-2fast.png', tone: 'lime' },
  { id: 'doppler', brand: 'DOPPLER', nameKey: 'productDoppler', category: 'performance', price: 10, image: '/images/stickers-doppler.png', tone: 'blue' },
  { id: 'spectra', brand: 'SPECTRA', nameKey: 'productSpectra', category: 'spectra', price: 16, image: '/images/spectra-custom-decals.jpg', tone: 'lime' },
]

const merch = [
  { id: 'tee', nameKey: 'merchTee', descriptionKey: 'teeDesc', categoryKey: 'teeCategory', price: 45, image: '/images/spectra-shirt.jpg', tone: 'blue' },
  { id: 'hoodie', nameKey: 'merchHoodie', descriptionKey: 'hoodieDesc', categoryKey: 'hoodieCategory', price: 79, image: 'photo-1556821840-3a63f95609a7', tone: 'lime' },
  { id: 'crewneck', nameKey: 'merchCrew', descriptionKey: 'crewDesc', categoryKey: 'crewCategory', price: 65, image: 'photo-1578681994506-b8f463449011', tone: 'violet' },
]

const services = [
  { number: '01', titleKey: 'servicePaint', descriptionKey: 'servicePaintDesc', tagKeys: ['paintTag1', 'paintTag2', 'paintTag3'], icon: '✳' },
  { number: '02', titleKey: 'serviceDecals', descriptionKey: 'serviceDecalsDesc', tagKeys: ['decalTag1', 'decalTag2', 'decalTag3'], icon: '↗' },
  { number: '03', titleKey: 'serviceApparel', descriptionKey: 'serviceApparelDesc', tagKeys: ['apparelTag1', 'apparelTag2', 'apparelTag3'], icon: '▤' },
  { number: '04', titleKey: 'serviceRepairTitle', descriptionKey: 'serviceRepairDesc', tagKeys: ['repairTag1', 'repairTag2', 'repairTag3'], icon: '⌁' },
]

const gallery = [
  { id: 'car', titleKey: 'galleryCarTitle', kind: 'decalJobs', image: '/images/spectra-rally-car.jpg', labelKey: 'decalGallery' },
  { id: 'fairings', titleKey: 'galleryFairingsTitle', kind: 'decalJobs', image: '/images/spectra-fairings.jpg', labelKey: 'decalGallery' },
  { id: 'apparel', titleKey: 'galleryTitle', kind: 'apparelJobs', image: '/images/spectra-shirt.jpg', labelKey: 'apparelGallery' },
  { id: 'stickers', titleKey: 'galleryStickerTitle', kind: 'decalJobs', image: '/images/spectra-custom-decals.jpg', labelKey: 'decalGallery' },
  { id: 'scooter', titleKey: 'galleryScooterTitle', kind: 'paintJobs', image: '/images/spectra-scooter.jpg', labelKey: 'paintGallery' },
]

const colorways = [
  { key: 'matteBlack', value: '#18191a' }, { key: 'carbonGrey', value: '#71757b' },
  { key: 'cyberWhite', value: '#e5e7eb' }, { key: 'neon', value: '#00f0ff' },
]
const finishes = ['finishGloss', 'finishMatte', 'finishChrome', 'finishHolo', 'finishReflective']
const placements = ['chest', 'backPrint', 'sleeve']
const finishKeys = { finishGloss: 'Gloss', finishMatte: 'Matte', finishChrome: 'Chrome', finishHolo: 'Holographic', finishReflective: 'Reflective' }
const priceText = (amount, currency, lang) => {
  const eur = `€${amount.toFixed(2)}`
  const mkd = `${Math.round(amount * MKD_PER_EUR).toLocaleString('mk-MK')} ден.`
  return currency === 'MKD' ? `${mkd} / ${eur}` : `${eur} / ${mkd}`
}

function Brand() {
  return <a className="brand" href="#top" aria-label="Spectracustoms"><span className="brand-mark">S<span>.</span></span><span className="brand-type">SPECTRA<span>CUSTOMS</span></span><span className="brand-separator" /></a>
}

function ThemeControls({ lang, theme, onTheme, t, compact = false }) {
  return <div className={`theme-controls ${compact ? 'theme-compact' : ''}`} role="group" aria-label={t('theme')}>
    <span className="theme-label">{t('theme')}</span>
    {themes.map(({ id, color }) => {
      const label = t(`theme${id[0].toUpperCase()}${id.slice(1)}`)
      return <button type="button" key={id} title={label} aria-label={label} aria-pressed={theme === id} className={theme === id ? 'active' : ''} onClick={() => onTheme(id)}><span style={{ '--theme-swatch': color }} /></button>
    })}
  </div>
}

function LocaleControls({ lang, currency, onLanguage, onCurrency, t, compact = false }) {
  const nativeLanguageNames = { mk: 'Македонски', sq: 'Shqip', en: 'English' }
  return <div className={`locale-controls ${compact ? 'locale-compact' : ''}`}>
    <div className="locale-group" role="group" aria-label={t('language')}><span className="locale-label">{t('language')}</span>{Object.entries(languageNames).map(([code, name]) => <button type="button" key={code} title={nativeLanguageNames[code]} aria-label={nativeLanguageNames[code]} className={lang === code ? 'active' : ''} aria-pressed={lang === code} onClick={() => onLanguage(code)}>{name}</button>)}</div>
    <div className="locale-group currency-group" role="group" aria-label={t('currency')}><span className="locale-label">{t('currency')}</span>{['EUR', 'MKD'].map(code => <button type="button" key={code} title={code} aria-label={code} className={currency === code ? 'active' : ''} aria-pressed={currency === code} onClick={() => onCurrency(code)}>{code === 'EUR' ? '€' : 'ден.'}</button>)}</div>
  </div>
}

function Header({ cartCount, onCart, lang, currency, theme, onLanguage, onCurrency, onTheme, t }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const links = [['#top', 'navHome'], ['#services', 'navServices'], ['#shop', 'navShop'], ['#merch', 'navMerch'], ['#work', 'navWork'], ['#community', 'navCommunity'], ['#contact', 'navContact']]
  return <header className="site-header">
    <Brand />
    <button className="menu-toggle" type="button" aria-label={menuOpen ? t('closeMenu') : t('menu')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    {menuOpen && <button className="mobile-menu-scrim" type="button" aria-label={t('closeMenu')} onClick={closeMenu} />}
    <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label={t('navServices')}>
      <div className="mobile-drawer-head"><Brand /><button type="button" className="drawer-close" aria-label={t('closeMenu')} onClick={closeMenu}>×</button></div>
      <div className="drawer-links">{links.map(([href, key]) => <a href={href} key={href} onClick={closeMenu}>{t(key)}</a>)}</div>
      <LocaleControls lang={lang} currency={currency} onLanguage={onLanguage} onCurrency={onCurrency} t={t} compact />
      <ThemeControls lang={lang} theme={theme} onTheme={onTheme} t={t} compact />
      <button className="drawer-cart" type="button" onClick={() => { closeMenu(); onCart() }}><span>{t('cart')}</span><b>{cartCount}</b><span>↗</span></button>
      <a className="drawer-quote" href="#quote" onClick={closeMenu}>{t('quoteCta')} <span>↗</span></a>
    </nav>
    <div className="header-actions"><LocaleControls lang={lang} currency={currency} onLanguage={onLanguage} onCurrency={onCurrency} t={t} /><ThemeControls lang={lang} theme={theme} onTheme={onTheme} t={t} /><button className="cart-trigger" type="button" onClick={onCart} aria-label={`${t('cart')}, ${cartCount}`}><span className="bag-icon">▱</span><span>{t('cart')}</span><b>{cartCount}</b></button><a className="header-cta" href="#quote">{t('quoteCta')} <span>↗</span></a></div>
  </header>
}

function Hero({ t }) {
  return <section className="hero" id="top"><div className="hero-image" style={{ '--hero-image': `url("${imageUrl('/images/spectra-scooter.jpg')}")` }} aria-hidden="true" /><div className="hero-shade" aria-hidden="true" /><div className="hero-content">
    <p className="eyebrow"><span className="live-dot" /> {t('heroEyebrow')} <span className="eyebrow-slash">/</span> EST. 2018</p>
    <h1>{t('heroTitle')}<br /><span>{t('heroTitleAccent')}</span></h1><p className="hero-description">{t('heroDescription')}</p>
    <div className="hero-buttons"><a className="button button-lime" href="#shop">{t('heroShop')} <span>↗</span></a><a className="button button-outline" href="#quote">{t('heroQuote')} <span>↓</span></a></div>
    <div className="hero-proof"><span>01 <i /> {t('heroFact1')}</span><span>02 <i /> {t('heroFact2')}</span></div>
  </div><div className="hero-caption"><span>01 / 03</span><span>{t('heroCaption')}</span><span className="caption-line" /></div><a className="scroll-cue" href="#services" aria-label={t('scroll')}>{t('scroll')} <span>↓</span></a></section>
}

function IntroStrip({ t }) {
  return <div className="ticker" aria-label={t('servicesEyebrow')}><div className="ticker-track">{Array.from({ length: 2 }, (_, i) => <span key={i}>{t('ticker1')} <b>✳</b> {t('ticker2')} <b>✳</b> {t('ticker3')} <b>✳</b> {t('ticker4')} <b>✳</b></span>)}</div></div>
}

function Services({ t }) {
  return <section className="section services-section" id="services"><div className="section-heading"><div><p className="eyebrow section-eyebrow">{t('servicesEyebrow')}</p><h2>{t('servicesTitle')}<br /><span>{t('servicesAccent')}</span></h2></div><p className="section-intro">{t('servicesIntro')}</p></div>
    <div className="services-grid">{services.map(service => <article className="service-card" key={service.number}><div className="service-top"><span>{service.number} / {String(services.length).padStart(2, '0')}</span><span className="service-symbol">{service.icon}</span></div><h3>{t(service.titleKey)}</h3><p>{t(service.descriptionKey)}</p><ul>{service.tagKeys.map(key => <li key={key}>{t(key)}</li>)}</ul><a href="#quote" className="text-link">{t('startProject')} <span>↗</span></a></article>)}</div></section>
}

function TrustSection({ t }) {
  return <section className="trust-band"><div className="trust-mantra"><span className="live-dot" /> {t('trustMantra')}</div><div className="trust-review"><span className="trust-stars">{t('trustLabel')}</span><p>{t('trustText')}</p><small>{t('trustFoot')}</small></div><a className="trust-chat" href={`https://wa.me/${WHATSAPP_NUMBER}?text=Spectracustoms`} target="_blank" rel="noreferrer">{t('directChat')} <span>↗</span></a></section>
}

function ProjectSpotlight({ t }) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('spotlightWhatsAppMessage'))}`
  return <section className="project-spotlight" aria-labelledby="spotlight-title">
    <div className="spotlight-photo">
      <img src={imageUrl('/images/spectra-rally-car.jpg')} alt={t('spotlightImageAlt')} loading="lazy" />
      <span className="spotlight-photo-label">SPECTRA / BUILD 01</span>
      <span className="spotlight-location"><span className="live-dot" /> KUMANOVO, MK</span>
    </div>
    <div className="spotlight-copy">
      <p className="eyebrow section-eyebrow">{t('spotlightEyebrow')}</p>
      <h2 id="spotlight-title">{t('spotlightTitle')}<br /><span>{t('spotlightAccent')}</span></h2>
      <p className="spotlight-description">{t('spotlightDescription')}</p>
      <ul>{['spotlightPoint1', 'spotlightPoint2', 'spotlightPoint3'].map((key, index) => <li key={key}><span>0{index + 1}</span>{t(key)}</li>)}</ul>
      <div className="spotlight-actions">
        <a className="button button-lime" href={whatsappUrl} target="_blank" rel="noreferrer">{t('spotlightWhatsapp')} <span>↗</span></a>
        <a className="spotlight-secondary" href="#work">{t('spotlightGallery')} <span>↓</span></a>
      </div>
    </div>
  </section>
}

function ProductCard({ product, onAdd, t, currency, lang }) {
  const [finish, setFinish] = useState('finishGloss')
  const [size, setSize] = useState('M')
  return <article className="product-card"><div className={`product-visual tone-${product.tone}${product.image ? ' has-product-image' : ' product-brand-art'}`} >{product.image ? <img className="product-image" src={imageUrl(product.image, 'auto=format&fit=crop&w=780&q=80')} alt={`${product.brand} ${t('stickerSet')}`} loading="lazy" /> : <div className="product-brand-mark" aria-hidden="true">{product.brand}</div>}<span className="product-brand">{product.brand}</span>{!product.image && <span className="product-sticker">{product.brand}<small>{t('racingSeries')}</small></span>}<span className="product-visual-index">SC / 0{products.indexOf(product) + 1}</span></div>
    <div className="product-info"><div className="product-title-row"><div><span className="product-category">{t(product.category)} / {t('stickerSet')}</span><h3>{t(product.nameKey)}</h3></div><strong>{priceText(product.price, currency, lang)}</strong></div>
      <div className="product-options"><label>{t('finish')}<select value={finish} onChange={event => setFinish(event.target.value)} aria-label={`${t('finish')}: ${t(product.nameKey)}`}>{finishes.map(key => <option value={key} key={key}>{t(key)}</option>)}</select></label><label>{t('size')}<select value={size} onChange={event => setSize(event.target.value)} aria-label={`${t('size')}: ${t(product.nameKey)}`}>{['S', 'M', 'L', 'XL', 'XXL'].map(option => <option key={option}>{option}</option>)}</select></label></div>
      <button className="add-button" type="button" onClick={() => onAdd({ kind: 'sticker', id: product.id, brand: product.brand, price: product.price, tone: product.tone, finishKey: finish, size, key: `${product.id}-${finish}-${size}` })}>{t('add')} <span>＋</span></button>
    </div></article>
}

function Shop({ onAdd, t, currency, lang }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const categories = ['all', 'performance', 'racing', 'spectra']
  const filtered = useMemo(() => products.filter(product => (category === 'all' || product.category === category) && `${product.brand} ${t(product.nameKey)}`.toLowerCase().includes(search.toLowerCase())), [category, search, lang])
  return <section className="section shop-section" id="shop"><div className="section-heading shop-heading"><div><p className="eyebrow section-eyebrow">{t('shopEyebrow')}</p><h2>{t('shopTitle')}<br /><span>{t('shopAccent')}</span></h2></div><p className="section-intro">{t('shopDescription')}</p></div>
    <div className="shop-toolbar"><div className="category-tabs" role="group" aria-label={t('filterProducts')}>{categories.map(key => <button key={key} type="button" className={category === key ? 'active' : ''} onClick={() => setCategory(key)}>{t(key)}<span>{key === 'all' ? products.length : products.filter(product => product.category === key).length}</span></button>)}</div><label className="search-field"><span>⌕</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('search')} aria-label={t('search')} /></label></div>
    {filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} t={t} currency={currency} lang={lang} />)}</div> : <p className="empty-results">{t('noProducts')}</p>}
    <div className="shop-footer"><span>{t('showing')} {filtered.length} / {products.length} {t('sets')}</span><a href="#quote" className="text-link">{t('customAsk')} <span>↗</span></a></div></section>
}

function MerchCard({ product, index, onAdd, t, currency, lang }) {
  const [colorway, setColorway] = useState(colorways[0])
  const [size, setSize] = useState('M')
  const [customText, setCustomText] = useState('')
  const [placement, setPlacement] = useState('chest')
  const key = `${product.id}-${colorway.key}-${size}-${placement}-${customText.trim()}`
  return <article className="merch-card"><div className="merch-visual" style={{ '--merch-image': `url("${imageUrl(product.image, 'auto=format&fit=crop&w=900&q=85')}")`, '--garment-color': colorway.value }}><span className="merch-index">SC / GEAR 0{index + 1}</span><div className={`merch-photo${product.image.startsWith('/images/') ? ' merch-photo-authentic' : ''}`} /><div className={`merch-custom-preview placement-${placement}`} style={{ color: colorway.key === 'cyberWhite' ? '#111' : colorway.key === 'neon' ? '#00f0ff' : '#f4f6f7' }}>{customText.trim() || 'SPECTRA'}</div><span className="merch-color-label">{t(colorway.key).toUpperCase()}</span></div>
    <div className="merch-info"><div className="merch-title-row"><div><span>{t(product.categoryKey)}</span><h3>{t(product.nameKey)}</h3><small>{t(product.descriptionKey)}</small></div><strong>{priceText(product.price, currency, lang)}</strong></div>
      <div className="merch-personalize"><label htmlFor={`personalize-${product.id}`}>{t('personalize')}</label><input id={`personalize-${product.id}`} value={customText} onChange={event => setCustomText(event.target.value.slice(0, 14))} placeholder={t('textPlaceholder')} maxLength={14} aria-label={`${t('personalize')}: ${t(product.nameKey)}`} /></div>
      <label className="placement-picker">{t('placement')}<select value={placement} onChange={event => setPlacement(event.target.value)}>{placements.map(key => <option key={key} value={key}>{t(key)}</option>)}</select></label>
      <div className="merch-options"><div className="colorway-picker"><span>{t('color')} / {t(colorway.key).toUpperCase()}</span><div>{colorways.map(option => <button key={option.key} type="button" title={t(option.key)} aria-label={t(option.key)} aria-pressed={colorway.key === option.key} className={colorway.key === option.key ? 'selected' : ''} style={{ '--swatch': option.value }} onClick={() => setColorway(option)} />)}</div></div>
        <label className="merch-size">{t('size')}<select aria-label={`${t(product.nameKey)} — ${t('size')}`} value={size} onChange={event => setSize(event.target.value)}>{['S', 'M', 'L', 'XL', 'XXL'].map(option => <option key={option}>{option}</option>)}</select></label></div>
      <button className="add-button merch-add" type="button" onClick={() => onAdd({ kind: 'merch', id: product.id, price: product.price, tone: product.tone, colorKey: colorway.key, placement, size, customText: customText.trim(), key })}>{t('addQuick')} <span>＋</span></button>
    </div></article>
}

function MerchSection({ onAdd, t, currency, lang }) {
  return <section className="section merch-section" id="merch"><div className="section-heading merch-heading"><div><p className="eyebrow section-eyebrow">{t('merchEyebrow')}</p><h2>{t('merchTitle')}<br /><span>{t('merchAccent')}</span></h2></div><p className="section-intro">{t('merchDescription')}</p></div>
    <div className="merch-meta"><span>{t('studioUniform')}</span><span>{t('madeToOrder')}</span></div><div className="merch-grid">{merch.map((product, index) => <MerchCard key={product.id} product={product} index={index} onAdd={onAdd} t={t} currency={currency} lang={lang} />)}</div>
    <div className="merch-endnote"><span>{t('merchEnd1')}</span><span>{t('merchEnd2')} <b>↗</b></span></div></section>
}

function hslToHex(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const hueSegment = hue / 60
  const x = chroma * (1 - Math.abs((hueSegment % 2) - 1))
  const [red, green, blue] = hueSegment < 1 ? [chroma, x, 0]
    : hueSegment < 2 ? [x, chroma, 0]
      : hueSegment < 3 ? [0, chroma, x]
        : hueSegment < 4 ? [0, x, chroma]
          : hueSegment < 5 ? [x, 0, chroma]
            : [chroma, 0, x]
  const offset = lightness - chroma / 2
  return `#${[red, green, blue].map(channel => Math.round((channel + offset) * 255).toString(16).padStart(2, '0')).join('')}`
}

function hexToHue(hex) {
  const channels = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!channels) return 184
  const [red, green, blue] = channels.slice(1).map(channel => parseInt(channel, 16) / 255)
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  if (delta === 0) return 0
  const hue = max === red ? ((green - blue) / delta) % 6
    : max === green ? (blue - red) / delta + 2
      : (red - green) / delta + 4
  return Math.round((hue * 60 + 360) % 360)
}

function QuoteCalculator({ t, currency, lang }) {
  const [service, setService] = useState('paint')
  const [vehicle, setVehicle] = useState('motorcycle')
  const [motorType, setMotorType] = useState('scooter')
  const [finish, setFinish] = useState('standardPaint')
  const [paintHex, setPaintHex] = useState('#00f0ff')
  const [spectrumHue, setSpectrumHue] = useState(184)
  const [repairType, setRepairType] = useState('smallCrack')
  const [apparelType, setApparelType] = useState('tee')
  const [apparelColor, setApparelColor] = useState('matteBlack')
  const [apparelSize, setApparelSize] = useState('L')
  const [apparelPlacement, setApparelPlacement] = useState('chest')
  const [apparelText, setApparelText] = useState('')
  const [stickerOpen, setStickerOpen] = useState(true)
  const [stickerText, setStickerText] = useState('SPECTRA')
  const [stickerShape, setStickerShape] = useState('stickerRectangle')
  const [stickerSize, setStickerSize] = useState('fullMotor')
  const [stickerQuantity, setStickerQuantity] = useState(1)
  const [requestDetails, setRequestDetails] = useState('')
  const [otherVehicle, setOtherVehicle] = useState('')
  const [stickerFile, setStickerFile] = useState('')
  const finishesForService = service === 'paint'
    ? ['standardPaint', 'metallic', 'chameleon']
    : ['standardVinyl', 'reflectiveVinyl', 'customGraphics']
  const paintColors = [
    { key: 'colorIce', hex: '#f1f4f5' },
    { key: 'colorRaceRed', hex: '#dc2637' },
    { key: 'colorElectricBlue', hex: '#00a9ff' },
    { key: 'colorDeepPurple', hex: '#7024d8' },
    { key: 'colorAcidGreen', hex: '#c7ff00' },
    { key: 'colorGraphite', hex: '#34383d' },
    { key: 'colorGold', hex: '#d4a438' },
  ]
  const serviceName = {
    paint: t('paintOption'),
    decals: t('customStickersOption'),
    apparel: t('makeShirtOption'),
    repair: t('serviceRepairOption'),
  }[service]
  const vehicleName = vehicle === 'motorcycle'
    ? `${t('motorcycle')} — ${t(motorType)}${motorType === 'otherBike' && otherVehicle ? ` (${otherVehicle})` : ''}`
    : t('car')
  const stickerSizes = {
    small: euroPriceFromDenars(500),
    medium: euroPriceFromDenars(1000),
    large: euroPriceFromDenars(1800),
    fullMotor: euroPriceFromDenars(3300),
  }
  const stickerCount = Math.max(1, Math.min(100, Number(stickerQuantity) || 1))
  const garmentPrices = { tee: 45, hoodie: 79, crewneck: 65 }
  let low
  if (service === 'paint') {
    const motorcyclePrices = {
      scooter: euroPriceFromDenars(8500),
      sportbike: euroPriceFromDenars(14500),
      largeBike: euroPriceFromDenars(14500),
      otherBike: euroPriceFromDenars(14500),
    }
    low = vehicle === 'car' ? euroPriceFromDenars(35000) : motorcyclePrices[motorType]
    low += { standardPaint: 0, metallic: euroPriceFromDenars(1500), chameleon: euroPriceFromDenars(3000) }[finish]
  } else if (service === 'repair') {
    low = {
      smallCrack: euroPriceFromDenars(3200),
      brokenMount: euroPriceFromDenars(4200),
      scratches: euroPriceFromDenars(3500),
      multipleDamage: euroPriceFromDenars(6000),
    }[repairType]
    if (vehicle === 'car') low = Math.round(low * 1.5)
  } else if (service === 'decals') {
    low = (stickerSizes[stickerSize] + {
      standardVinyl: 0,
      reflectiveVinyl: euroPriceFromDenars(400),
      customGraphics: euroPriceFromDenars(600),
    }[finish]) * stickerCount
  } else {
    low = garmentPrices[apparelType] * stickerCount
  }
  const high = low + Math.max(10, Math.round(low * .38))
  const range = `${priceText(low, currency, lang)} — ${priceText(high, currency, lang)}`
  const details = [
    `${t('service')}: ${serviceName}`,
    service === 'paint' || service === 'repair' || service === 'decals' ? `${t('vehicle')}: ${vehicleName}` : '',
    service === 'paint' ? `${t('paintFinish')}: ${t(finish)}; ${t('paintColor')}: ${paintHex}` : '',
    service === 'repair' ? `${t('repairType')}: ${t(repairType)}` : '',
    service === 'decals' ? `${t('stickerText')}: "${stickerText || t('stickerPlaceholder')}"; ${t('stickerShape')}: ${t(stickerShape)}; ${t('stickerSize')}: ${t(`sticker${stickerSize[0].toUpperCase()}${stickerSize.slice(1)}`)}; ${t('stickerQuantity')}: ${stickerCount}; ${t('stickerFinish')}: ${t(finish)}; #${paintHex.replace('#', '')}${stickerFile ? `; ${stickerFile}` : ''}` : '',
    service === 'apparel' ? `${t('apparelType')}: ${t(apparelType)}; ${t('color')}: ${t(apparelColor)}; ${t('size')}: ${apparelSize}; ${t('placement')}: ${t(apparelPlacement)}; ${apparelText.trim() ? `${t('personalize')}: ${apparelText.trim()}; ` : ''}${t('units')}: ${stickerCount}` : '',
    requestDetails.trim() ? `${t('customRequest')}: ${requestDetails.trim()}` : '',
    `${t('estimateIs')} ${range}`,
  ].filter(Boolean)
  const message = encodeURIComponent(`${t('estimateMessage')}\n${details.join('\n')}`)
  const email = `mailto:?subject=${encodeURIComponent(t('estimateSubject'))}&body=${message}`
  return <section className="section quote-section" id="quote"><div className="quote-grid"><div className="quote-copy"><p className="eyebrow section-eyebrow">{t('quoteEyebrow')}</p><h2>{t('quoteTitle')}<br /><span>{t('quoteAccent')}</span></h2><p>{t('quoteDescription')}</p><div className="quote-note"><span>↳</span> {t('estimateNote')}</div></div>
    <div className="calculator"><div className="calculator-top"><span>{t('calculator')}</span><span>01 — 04</span></div>
      <label className="calc-label">{t('chooseService')}<select value={service} onChange={event => { const next = event.target.value; setService(next); setFinish(next === 'paint' ? 'standardPaint' : 'standardVinyl'); setStickerOpen(next === 'decals') }}>
        <option value="paint">{t('paintOption')}</option><option value="decals">{t('customStickersOption')}</option><option value="apparel">{t('makeShirtOption')}</option><option value="repair">{t('serviceRepairOption')}</option>
      </select></label>
      {(service === 'paint' || service === 'repair' || service === 'decals') && <label className="calc-label">{t('vehicleKindLabel')}<select value={vehicle} onChange={event => { const next = event.target.value; setVehicle(next); if (next === 'car' && stickerSize === 'fullMotor') setStickerSize('large') }}><option value="motorcycle">{t('motorcycle')}</option><option value="car">{t('car')}</option></select></label>}
      {(service === 'paint' || service === 'repair') && vehicle === 'motorcycle' && <label className="calc-label">{t('motorType')}<select value={motorType} onChange={event => setMotorType(event.target.value)}><option value="scooter">{t('scooter')}</option><option value="sportbike">{t('sportbike')}</option><option value="largeBike">{t('largeBike')}</option><option value="otherBike">{t('otherBike')}</option></select></label>}
      {motorType === 'otherBike' && vehicle === 'motorcycle' && (service === 'paint' || service === 'repair') && <label className="calc-label">{t('otherVehicle')}<input value={otherVehicle} onChange={event => setOtherVehicle(event.target.value)} placeholder={t('vehiclePlaceholder')} maxLength={60} /></label>}
      {service === 'paint' && <>
        <label className="calc-label">{t('paintFinish')}<select value={finish} onChange={event => setFinish(event.target.value)}>{finishesForService.map(key => <option value={key} key={key}>{t(key)}</option>)}</select></label>
        <div className="paint-color-panel"><span className="config-label">{t('colorCatalog')}</span><div className="paint-swatches">{paintColors.map(color => <button key={color.key} type="button" className={paintHex === color.hex ? 'selected' : ''} title={t(color.key)} aria-label={t(color.key)} aria-pressed={paintHex === color.hex} style={{ '--paint-swatch': color.hex }} onClick={() => { setPaintHex(color.hex); setSpectrumHue(hexToHue(color.hex)) }} />)}</div>
          <label className="spectrum-control">{t('paintSpectrum')}<input type="range" min="0" max="360" value={spectrumHue} onChange={event => { const hue = Number(event.target.value); setSpectrumHue(hue); setPaintHex(hslToHex(hue, 1, .5)) }} /></label>
          <label className="custom-color-control">{t('customColor')}<input type="color" value={paintHex.startsWith('#') ? paintHex : '#00f0ff'} onChange={event => { setPaintHex(event.target.value); setSpectrumHue(hexToHue(event.target.value)) }} /><output style={{ color: paintHex }}>{paintHex.toUpperCase()}</output></label>
        </div>
      </>}
      {service === 'repair' && <label className="calc-label">{t('repairType')}<select value={repairType} onChange={event => setRepairType(event.target.value)}><option value="smallCrack">{t('smallCrack')}</option><option value="brokenMount">{t('brokenMount')}</option><option value="scratches">{t('scratches')}</option><option value="multipleDamage">{t('multipleDamage')}</option></select></label>}
      {service === 'decals' && <div className="sticker-designer">
        <button className="designer-toggle" type="button" aria-expanded={stickerOpen} onClick={() => setStickerOpen(open => !open)}><span>{t('stickerStudio')}</span><b>{stickerOpen ? t('closeDesigner') : t('openDesigner')} {stickerOpen ? '−' : '+'}</b></button>
        {stickerOpen && <div className="designer-body">
          <label className="calc-label">{t('stickerText')}<input value={stickerText} onChange={event => setStickerText(event.target.value.slice(0, 24))} placeholder={t('stickerPlaceholder')} maxLength={24} /></label>
          <div className="sticker-preview-wrap"><span>{t('stickerPreview')}</span><div className={`sticker-live-preview shape-${stickerShape}`} style={{ '--sticker-color': paintHex }}>{stickerText || t('stickerPlaceholder')}</div></div>
          <div className="designer-controls"><label className="calc-label">{t('stickerShape')}<select value={stickerShape} onChange={event => setStickerShape(event.target.value)}><option value="stickerRectangle">{t('stickerRectangle')}</option><option value="stickerCircle">{t('stickerCircle')}</option><option value="stickerOutline">{t('stickerOutline')}</option></select></label>
            <label className="calc-label">{t('stickerSize')}<select value={stickerSize} onChange={event => setStickerSize(event.target.value)}><option value="small">{t('stickerSmall')}</option><option value="medium">{t('stickerMedium')}</option><option value="large">{t('stickerLarge')}</option>{vehicle === 'motorcycle' && <option value="fullMotor">{t('stickerFullMotor')}</option>}</select></label></div>
          <div className="designer-controls"><label className="calc-label">{t('stickerFinish')}<select value={finish} onChange={event => setFinish(event.target.value)}>{finishesForService.map(key => <option key={key} value={key}>{t(key)}</option>)}</select></label>
            <label className="calc-label">{t('stickerQuantity')}<input type="number" min="1" max="100" value={stickerQuantity} onChange={event => setStickerQuantity(event.target.value)} /></label></div>
          <label className="calc-label sticker-color-input">{t('paintColor')}<input type="color" value={paintHex.startsWith('#') ? paintHex : '#00f0ff'} onChange={event => { setPaintHex(event.target.value); setSpectrumHue(hexToHue(event.target.value)) }} /></label>
          <label className="calc-label">{t('referencePhoto')}<input type="file" accept="image/*,.pdf,.svg" onChange={event => setStickerFile(event.target.files?.[0]?.name ?? '')} /></label>
        </div>}
      </div>}
      {service === 'apparel' && <>
        <label className="calc-label">{t('apparelType')}<select value={apparelType} onChange={event => setApparelType(event.target.value)}><option value="tee">{t('tee')}</option><option value="hoodie">{t('hoodie')}</option><option value="crewneck">{t('crewneck')}</option></select></label>
        <div className="quote-apparel-options">
          <div className="colorway-picker"><span>{t('color')} / {t(apparelColor).toUpperCase()}</span><div>{colorways.map(option => <button key={option.key} type="button" title={t(option.key)} aria-label={t(option.key)} aria-pressed={apparelColor === option.key} className={apparelColor === option.key ? 'selected' : ''} style={{ '--swatch': option.value }} onClick={() => setApparelColor(option.key)} />)}</div></div>
          <div className="designer-controls"><label className="calc-label">{t('size')}<select value={apparelSize} onChange={event => setApparelSize(event.target.value)}>{['S', 'M', 'L', 'XL', 'XXL'].map(size => <option key={size}>{size}</option>)}</select></label><label className="calc-label">{t('placement')}<select value={apparelPlacement} onChange={event => setApparelPlacement(event.target.value)}>{placements.map(key => <option key={key} value={key}>{t(key)}</option>)}</select></label></div>
        </div>
        <label className="calc-label">{t('personalize')}<input value={apparelText} onChange={event => setApparelText(event.target.value.slice(0, 14))} placeholder={t('textPlaceholder')} maxLength={14} /></label>
        <label className="calc-label">{t('units')}<input type="number" min="1" max="100" value={stickerQuantity} onChange={event => setStickerQuantity(Math.max(1, Math.min(100, Number(event.target.value) || 1)))} /></label>
      </>}
      <label className="calc-label">{t('customRequest')}<textarea rows="2" maxLength="500" value={requestDetails} onChange={event => setRequestDetails(event.target.value)} placeholder={t('customPlaceholder')} /></label>
      <div className="estimate"><span>{t('estimatedRange')}</span><strong>{range}</strong><small>{t('finalPriceNote')}</small></div><a className="button button-lime quote-submit" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`} target="_blank" rel="noreferrer">{t('requestWhatsApp')} <span>↗</span></a><a className="quote-email" href={email}>{t('requestEmail')} ↗</a><p className="quote-includes">{t('quoteIncludes')}</p></div>
  </div></section>
}

function Portfolio({ t }) {
  const [filter, setFilter] = useState('allWork')
  const filters = ['allWork', 'paintJobs', 'decalJobs', 'apparelJobs']
  const items = gallery.filter(item => filter === 'allWork' || item.kind === filter)
  return <section className="section portfolio-section" id="work"><div className="section-heading"><div><p className="eyebrow section-eyebrow">{t('workEyebrow')}</p><h2>{t('workTitle')}<br /><span>{t('workAccent')}</span></h2></div><div className="portfolio-controls">{filters.map(key => <button key={key} type="button" className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{t(key)}</button>)}</div></div>
    <div className="gallery-grid">{items.map((item, index) => <article className="gallery-card" key={item.id}><div className={`gallery-image gallery-${index}${item.image.startsWith('/images/') ? ' gallery-authentic' : ''}`} style={{ '--gallery-image': `url("${imageUrl(item.image, 'auto=format&fit=crop&w=1100&q=85')}")` }} role="img" aria-label={t(item.labelKey)}><span className="gallery-count">{String(index + 1).padStart(2, '0')}</span><span className="gallery-arrow">↗</span></div><div className="gallery-caption"><h3>{item.titleKey ? t(item.titleKey) : item.title}</h3><span>{String(index + 1).padStart(2, '0')} — {t(item.labelKey)}</span></div></article>)}</div>
  </section>
}

function CommunityGallery({ t, lang }) {
  const [supabase, setSupabase] = useState(null)
  const [session, setSession] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [story, setStory] = useState('')
  const [instagram, setInstagram] = useState('')
  const [photo, setPhoto] = useState(null)
  const [entries, setEntries] = useState([])
  const [myEntries, setMyEntries] = useState([])
  const [pendingEntries, setPendingEntries] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(isSupabaseConfigured)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [working, setWorking] = useState(false)
  const [reviewing, setReviewing] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [photoUrl, setPhotoUrl] = useState('')
  const user = session?.user
  const dateLocale = lang === 'mk' ? 'mk-MK' : lang === 'sq' ? 'sq-AL' : 'en-GB'

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let active = true
    getSupabaseClient()
      .then(client => {
        if (active) setSupabase(client)
      })
      .catch(clientError => {
        if (active) {
          setError(`${t('communityErrorPrefix')} ${clientError.message}`)
          setCheckingAuth(false)
          setLoading(false)
        }
      })
    return () => { active = false }
  }, [lang])

  useEffect(() => {
    if (!supabase) return undefined
    let active = true
    supabase.auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (sessionError) throw sessionError
        if (active) setSession(data.session)
      })
      .catch(sessionError => {
        if (active) setError(`${t('communityErrorPrefix')} ${sessionError.message}`)
      })
      .finally(() => {
        if (active) setCheckingAuth(false)
      })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setError('')
      setNotice('')
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [lang])

  useEffect(() => {
    if (!photo) {
      setPhotoUrl('')
      return undefined
    }
    const objectUrl = URL.createObjectURL(photo)
    setPhotoUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  useEffect(() => {
    if (!supabase) return undefined
    let active = true
    async function loadGallery() {
      setLoading(true)
      setError('')
      try {
        const { data: approvedRows, error: approvedError } = await supabase
          .from('community_submissions')
          .select('id,image_path,display_name,vehicle,story,instagram,status,created_at')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(30)
        if (approvedError) throw approvedError
        const publicEntries = await Promise.all(approvedRows.map(async entry => {
          const { data, error: imageError } = await supabase.storage.from('community-photos').createSignedUrl(entry.image_path, 3600)
          if (imageError) throw imageError
          return { ...entry, signedUrl: data.signedUrl }
        }))

        let ownEntries = []
        let moderationQueue = []
        let admin = false
        if (user) {
          const { data: membership, error: membershipError } = await supabase
            .from('community_admins')
            .select('user_id')
            .eq('user_id', user.id)
            .maybeSingle()
          if (membershipError) throw membershipError
          admin = Boolean(membership)

          const { data: ownRows, error: ownError } = await supabase
            .from('community_submissions')
            .select('id,image_path,display_name,vehicle,story,instagram,status,created_at')
            .eq('user_id', user.id)
            .in('status', ['pending', 'approved'])
            .order('created_at', { ascending: false })
            .limit(12)
          if (ownError) throw ownError
          ownEntries = await Promise.all(ownRows.map(async entry => {
            const { data, error: imageError } = await supabase.storage.from('community-photos').createSignedUrl(entry.image_path, 3600)
            if (imageError) throw imageError
            return { ...entry, signedUrl: data.signedUrl }
          }))

          if (admin) {
            const { data: pendingRows, error: pendingError } = await supabase
              .from('community_submissions')
              .select('id,image_path,display_name,vehicle,story,instagram,status,created_at')
              .eq('status', 'pending')
              .order('created_at', { ascending: true })
              .limit(50)
            if (pendingError) throw pendingError
            moderationQueue = await Promise.all(pendingRows.map(async entry => {
              const { data, error: imageError } = await supabase.storage.from('community-photos').createSignedUrl(entry.image_path, 3600)
              if (imageError) throw imageError
              return { ...entry, signedUrl: data.signedUrl }
            }))
          }
        }

        if (active) {
          setEntries(publicEntries)
          setMyEntries(ownEntries)
          setPendingEntries(moderationQueue)
          setIsAdmin(admin)
        }
      } catch (loadError) {
        if (active) setError(`${t('communityErrorPrefix')} ${loadError.message}`)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadGallery()
    return () => { active = false }
  }, [user?.id, refreshKey, lang])

  async function submitAuth(event) {
    event.preventDefault()
    if (!supabase) return
    setWorking(true)
    setError('')
    setNotice('')
    try {
      const result = authMode === 'signup'
        ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.href.split('#')[0] } })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (result.error) throw result.error
      if (authMode === 'signup' && !result.data.session) setNotice(t('communityConfirmEmail'))
    } catch (authError) {
      setError(`${t('communityErrorPrefix')} ${authError.message}`)
    } finally {
      setWorking(false)
    }
  }

  async function signOut() {
    setWorking(true)
    setError('')
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      setPhoto(null)
      setMyEntries([])
      setPendingEntries([])
      setIsAdmin(false)
    } catch (signOutError) {
      setError(`${t('communityErrorPrefix')} ${signOutError.message}`)
    } finally {
      setWorking(false)
    }
  }

  async function submitBuild(event) {
    event.preventDefault()
    if (!supabase || !user) return
    const form = event.currentTarget
    const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[photo?.type]
    if (!photo || !extension || photo.size > 8 * 1024 * 1024) {
      setError(t('communityPhotoError'))
      return
    }
    setWorking(true)
    setError('')
    setNotice('')
    const imagePath = `${user.id}/${crypto.randomUUID()}.${extension}`
    try {
      const { error: uploadError } = await supabase.storage.from('community-photos').upload(imagePath, photo, {
        contentType: photo.type,
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadError) throw uploadError
      const { error: insertError } = await supabase.from('community_submissions').insert({
        user_id: user.id,
        image_path: imagePath,
        display_name: displayName.trim(),
        vehicle: vehicle.trim(),
        story: story.trim(),
        instagram: instagram.trim().replace(/^@/, '') || null,
        publication_consent: true,
        status: 'pending',
      })
      if (insertError) {
        const { error: cleanupError } = await supabase.storage.from('community-photos').remove([imagePath])
        throw new Error(cleanupError
          ? `${insertError.message} (${cleanupError.message})`
          : insertError.message)
      }
      setNotice(t('communitySubmissionSuccess'))
      setDisplayName('')
      setVehicle('')
      setStory('')
      setInstagram('')
      setPhoto(null)
      form.reset()
      setRefreshKey(key => key + 1)
    } catch (submitError) {
      setError(`${t('communityErrorPrefix')} ${submitError.message}`)
    } finally {
      setWorking(false)
    }
  }

  async function reviewSubmission(entry, status) {
    if (!supabase || !user || !isAdmin) return
    setReviewing(entry.id)
    setError('')
    setNotice('')
    try {
      const { error: updateError } = await supabase.from('community_submissions').update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      }).eq('id', entry.id).eq('status', 'pending')
      if (updateError) throw updateError
      setRefreshKey(key => key + 1)
      if (status === 'rejected') {
        const { error: removeError } = await supabase.storage.from('community-photos').remove([entry.image_path])
        if (removeError) throw new Error(`${t('communityReject')}: ${removeError.message}`)
      }
      setNotice(status === 'approved' ? t('communityApprove') : t('communityReject'))
    } catch (reviewError) {
      setError(`${t('communityErrorPrefix')} ${reviewError.message}`)
    } finally {
      setReviewing('')
    }
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))
  }

  function buildCard(entry, moderator = false) {
    return <article className="community-card" key={entry.id}>
      <img src={entry.signedUrl} alt={`${entry.vehicle} — ${entry.display_name}`} loading="lazy" />
      <div className="community-card-copy">
        <span className="community-card-date">{formatDate(entry.created_at)}</span>
        <h3>{entry.vehicle}</h3>
        <p className="community-card-author">{entry.display_name}{entry.instagram && <span> · @{entry.instagram.replace(/^@/, '')}</span>}</p>
        <p className="community-card-story">{entry.story}</p>
        {moderator && <div className="community-review-actions">
          <button className="community-approve" type="button" disabled={reviewing === entry.id} onClick={() => reviewSubmission(entry, 'approved')}>{t('communityApprove')}</button>
          <button className="community-reject" type="button" disabled={reviewing === entry.id} onClick={() => reviewSubmission(entry, 'rejected')}>{t('communityReject')}</button>
        </div>}
        {!moderator && entry.status === 'pending' && <span className="community-status">{t('communityPending')}</span>}
      </div>
    </article>
  }

  return <section className="section community-section" id="community" aria-labelledby="community-title">
    <div className="section-heading community-heading">
      <div><p className="eyebrow section-eyebrow">{t('communityEyebrow')}</p><h2 id="community-title">{t('communityTitle')}<br /><span>{t('communityAccent')}</span></h2></div>
      <p className="section-intro">{t('communityIntro')}</p>
    </div>
    {!isSupabaseConfigured ? <p className="community-feedback" role="status">{t('communityNotConfigured')}</p> : <>
      <div className="community-layout">
        <div className="community-gallery-area">
          <div className="community-subheading"><h3>{t('communityGalleryTitle')}</h3><span>{String(entries.length).padStart(2, '0')}</span></div>
          {loading ? <p className="community-empty">{t('communityLoading')}</p> : entries.length
            ? <div className="community-grid">{entries.map(entry => buildCard(entry))}</div>
            : <p className="community-empty">{t('communityEmpty')}</p>}
        </div>

        <aside className="community-panel">
          {!user ? <>
            <p className="eyebrow community-panel-eyebrow">{t('communityLoginTitle')}</p>
            <p className="community-panel-intro">{t('communityLoginIntro')}</p>
            {checkingAuth ? <p className="community-empty">{t('communityLoading')}</p> : <form className="community-form" onSubmit={submitAuth}>
              <label>{t('communityEmail')}<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>
              <label>{t('communityPassword')}<input type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} minLength="8" required value={password} onChange={event => setPassword(event.target.value)} /></label>
              <button className="button button-lime" type="submit" disabled={working}>{authMode === 'signup' ? t('communityCreateAccount') : t('communityLogin')} <span>↗</span></button>
              <p className="community-auth-switch">{authMode === 'signup' ? t('communityHaveAccount') : t('communityNeedAccount')} <button type="button" onClick={() => { setAuthMode(mode => mode === 'signup' ? 'login' : 'signup'); setError(''); setNotice('') }}>{authMode === 'signup' ? t('communityLogin') : t('communityCreateAccount')}</button></p>
            </form>}
          </> : <>
            <div className="community-account"><span>{user.email}</span><button type="button" disabled={working} onClick={signOut}>{t('communityLogout')}</button></div>
            <p className="eyebrow community-panel-eyebrow">{t('communitySubmitTitle')}</p>
            <form className="community-form" onSubmit={submitBuild}>
              <label>{t('communityDisplayName')}<input required minLength="2" maxLength="40" value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder={t('communityDisplayPlaceholder')} /></label>
              <label>{t('communityVehicle')}<input required minLength="2" maxLength="80" value={vehicle} onChange={event => setVehicle(event.target.value)} placeholder={t('communityVehiclePlaceholder')} /></label>
              <label>{t('communityStory')}<textarea required minLength="8" maxLength="500" rows="3" value={story} onChange={event => setStory(event.target.value)} placeholder={t('communityStoryPlaceholder')} /></label>
              <label>{t('communityInstagram')}<input maxLength="40" value={instagram} onChange={event => setInstagram(event.target.value)} placeholder={t('communityInstagramPlaceholder')} /></label>
              <label className="community-photo-field">{t('communityPhoto')}<input type="file" accept="image/jpeg,image/png,image/webp" required onChange={event => setPhoto(event.target.files?.[0] ?? null)} /><span>＋ &nbsp; {photo?.name || t('communityPhotoHelp')}</span></label>
              {photoUrl && <img className="community-photo-preview" src={photoUrl} alt={`${t('communityPhoto')} — ${vehicle || t('communityVehicle')}`} />}
              <label className="community-consent"><input type="checkbox" required /><span>{t('communityConsent')}</span></label>
              <button className="button button-lime" type="submit" disabled={working}>{working ? t('communitySubmitted') : t('communitySubmit')} <span>↗</span></button>
            </form>
          </>}
        </aside>
      </div>

      {myEntries.length > 0 && <div className="community-own-posts"><div className="community-subheading"><h3>{t('communityYourSubmissions')}</h3><span>{String(myEntries.length).padStart(2, '0')}</span></div><div className="community-grid">{myEntries.map(entry => buildCard(entry))}</div></div>}
      {isAdmin && <div className="community-moderation"><div className="community-subheading"><h3>{t('communityPendingTitle')}</h3><span>{String(pendingEntries.length).padStart(2, '0')}</span></div>{pendingEntries.length ? <div className="community-grid">{pendingEntries.map(entry => buildCard(entry, true))}</div> : <p className="community-empty">{t('communityEmpty')}</p>}</div>}
      {(error || notice) && <p className={`community-feedback${error ? ' is-error' : ''}`} role={error ? 'alert' : 'status'}>{error || notice}</p>}
    </>}
  </section>
}

function Contact({ t, lang }) {
  const [sent, setSent] = useState(false)
  function submit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const reference = data.get('reference')
    const attachment = reference?.name ? ` (${reference.name})` : ''
    const message = encodeURIComponent(`Spectracustoms — ${data.get('name')}, ${data.get('contact')}, ${data.get('project')}: ${data.get('details')}${attachment}`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }
  return <section className="section contact-section" id="contact"><div className="contact-copy"><p className="eyebrow section-eyebrow">{t('contactEyebrow')}</p><h2>{t('contactTitle')}<br /><span>{t('contactAccent')}</span></h2><p>{t('contactDescription')}</p><div className="contact-direct"><a href={`tel:+${WHATSAPP_NUMBER}`}><span>☎</span> 071 942 295</a><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('directChat'))}`} target="_blank" rel="noreferrer"><span>↗</span> {t('whatsappUs')}</a><a href="https://instagram.com/spectra.ku" target="_blank" rel="noreferrer"><span>↗</span> @SPECTRA.KU</a></div></div>
    <form className="contact-form" onSubmit={submit}><div className="form-row"><label>{t('yourName')}<input name="name" required placeholder={t('namePlaceholder')} /></label><label>{t('phone')}<input name="contact" required placeholder={t('phonePlaceholder')} /></label></div>
      <label>{t('projectType')}<select name="project"><option>{t('projectMotor')}</option><option>{t('projectCar')}</option><option>{t('customStickersOption')}</option><option>{t('projectApparel')}</option><option>{t('serviceRepairOption')}</option><option>{t('projectOther')}</option></select></label>
      <label>{t('details')}<textarea name="details" required rows="4" placeholder={t('detailsPlaceholder')} /></label>
      <label className="upload-field">{t('referencePhoto')}<input name="reference" type="file" accept="image/*" /><span>＋ &nbsp; {t('attach')}</span></label>
      <button className="button button-lime" type="submit">{sent ? t('openWhatsApp') : t('submitProject')} <span>↗</span></button><small>{t('privacy')}</small></form>
  </section>
}

function Footer({ t }) {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Zenix+Zperformance+Kumanovo'
  const mapEmbedUrl = 'https://maps.google.com/maps?q=Zenix%20Zperformance%20Kumanovo&output=embed'
  return <footer className="site-footer">
    <section className="footer-contact" aria-labelledby="footer-contact-title">
      <div className="footer-contact-info">
        <p className="eyebrow section-eyebrow">{t('footerContactTitle')}</p>
        <a className="footer-contact-item" href={`tel:+${WHATSAPP_NUMBER}`}><span>☎</span><small>{t('footerPhone')}</small><strong>071 942 295</strong></a>
        <a className="footer-contact-item" href={mapsUrl} target="_blank" rel="noreferrer"><span>⌖</span><small>{t('footerLocation')}</small><strong>Zenix Zperformance</strong><em>{t('footerCity')}</em></a>
        <a className="footer-map-link" href={mapsUrl} target="_blank" rel="noreferrer">{t('footerMapLink')} ↗</a>
      </div>
      <div className="footer-map-frame">
        <iframe title={t('footerMapTitle')} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <a href={mapsUrl} target="_blank" rel="noreferrer">{t('footerMapLink')} ↗</a>
      </div>
    </section>
    <div className="footer-main"><Brand /><p>{t('footerText')}<br />{t('footerSub')}</p><a href="#top" className="back-top">{t('backTop')}</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SPECTRACUSTOMS. {t('footerMotto')}</span><span>{t('footerServices')}</span><a href="https://instagram.com/spectra.ku" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></div>
  </footer>
}

function CartDrawer({ cart, onClose, onChange, t, currency, lang }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const orderText = `${t('orderMessage')} ${cart.map(item => {
    const name = item.kind === 'merch' ? t(merch.find(product => product.id === item.id).nameKey) : t(products.find(product => product.id === item.id).nameKey)
    const options = item.kind === 'merch' ? `${t(item.colorKey)}, ${item.size}, ${t(item.placement)}${item.customText ? `, ${t('orderText')} ${item.customText}` : ''}` : `${t(item.finishKey)}, ${item.size}`
    return `${item.quantity}× ${item.brand} ${name} (${options}) — ${priceText(item.price * item.quantity, currency, lang)}`
  }).join('; ')}. ${t('subtotal')}: ${priceText(total, currency, lang)}.`
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label={t('cart')} onClick={event => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">{t('yourSelection')}</span><h2>{t('cartTitle')} <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span></h2></div><button type="button" onClick={onClose} aria-label={t('closeCart')}>×</button></div>
    {cart.length === 0 ? <div className="cart-empty"><span>▱</span><p>{t('emptyCart')}</p><button className="text-link" type="button" onClick={onClose}>{t('findStickers')}</button></div> : <><div className="cart-items">{cart.map(item => {
      const name = item.kind === 'merch' ? t(merch.find(product => product.id === item.id).nameKey) : t(products.find(product => product.id === item.id).nameKey)
      const variation = item.kind === 'merch' ? t(item.colorKey) : t(item.finishKey)
      return <article className="cart-item" key={item.key}><div className={`cart-thumb tone-${item.tone}`}><span>{item.brand}</span></div><div className="cart-item-info"><span>{item.brand} / {variation} / {item.size}</span><h3>{name}</h3>{item.placement && <small className="cart-personalization">{t(item.placement)}</small>}{item.customText && <small className="cart-personalization">{t('customMark')} {item.customText}</small>}<strong>{priceText(item.price * item.quantity, currency, lang)}</strong><div className="quantity-control"><button type="button" aria-label={`− ${name}`} onClick={() => onChange(item.key, -1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={`+ ${name}`} onClick={() => onChange(item.key, 1)}>＋</button></div></div></article>
    })}</div><div className="cart-total"><span>{t('total')}</span><strong>{priceText(total, currency, lang)}</strong><small>{t('shipping')}</small><a className="button button-lime" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`} target="_blank" rel="noreferrer">{t('orderWhatsApp')} ↗</a></div></>}</aside></div>
}

export default function App() {
  const [lang, setLang] = useState('mk')
  const [currency, setCurrency] = useState('EUR')
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage?.getItem('spectra-theme')
    return themes.some(option => option.id === storedTheme) ? storedTheme : 'cyan'
  })
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [stickyCtaSuppressed, setStickyCtaSuppressed] = useState(false)
  const t = key => translations[lang][key] ?? configuratorCopy[lang]?.[key] ?? themeTranslations[lang]?.[key] ?? communityTranslations[lang]?.[key] ?? translations.en[key] ?? configuratorCopy.en[key] ?? themeTranslations.en[key] ?? communityTranslations.en[key] ?? key
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t('documentTitle')
    const description = document.querySelector('meta[name="description"]')
    if (description) description.content = t('metaDescription')
  }, [lang])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage?.setItem('spectra-theme', theme)
  }, [theme])
  useEffect(() => {
    const ctaSections = [...document.querySelectorAll('#quote, .project-spotlight')]
    if (!ctaSections.length || typeof IntersectionObserver === 'undefined') return undefined
    const visibleSections = new Set()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visibleSections.add(entry.target) : visibleSections.delete(entry.target))
      setStickyCtaSuppressed(visibleSections.size > 0)
    }, { threshold: 0.08 })
    ctaSections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  function addToCart(product, openCart = false) {
    setCart(current => {
      const exists = current.find(item => item.key === product.key)
      return exists ? current.map(item => item.key === product.key ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]
    })
    if (openCart) setCartOpen(true)
  }
  function changeQuantity(key, delta) {
    setCart(current => current.map(item => item.key === key ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0))
  }
  const localeProps = { lang, currency, t }
  return <div className="page"><Header cartCount={count} onCart={() => setCartOpen(true)} onLanguage={setLang} onCurrency={setCurrency} theme={theme} onTheme={setTheme} {...localeProps} /><main><Hero t={t} /><IntroStrip t={t} /><Services t={t} /><TrustSection t={t} /><ProjectSpotlight t={t} /><Shop onAdd={addToCart} {...localeProps} /><MerchSection onAdd={product => addToCart(product, true)} {...localeProps} /><QuoteCalculator {...localeProps} /><Portfolio t={t} /><CommunityGallery t={t} lang={lang} /><Contact t={t} lang={lang} /></main><Footer t={t} /><a className={`mobile-sticky-quote${stickyCtaSuppressed ? ' is-hidden' : ''}`} href="#quote" aria-hidden={stickyCtaSuppressed} tabIndex={stickyCtaSuppressed ? -1 : 0}>{t('quoteCta')} <span>↗</span></a>{cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onChange={changeQuantity} {...localeProps} />}</div>
}
