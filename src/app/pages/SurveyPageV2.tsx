import { useState, useEffect } from 'react';
import { ChevronDown, Search, X, Coffee, Package, Key, Backpack, Medal, Shirt } from 'lucide-react';
import { motion } from 'motion/react';
import nhlShopLogo from '../../imports/NHL-league-logo.png';
import jibeRetailLogo from 'figma:asset/cb0c31c8627df177a5621b8e80dd4ed9c5d25bc1.png';
import nhlLeagueLogo from '../../imports/NHL-league-logo.png';
import iceBg from '../../imports/85f8180c-bb6f-4cd0-974f-41394de11f27__1_.jpg';

// NHL team logos placeholder — will be replaced once team icons are uploaded
const nhlTeamLogoPlaceholder = nhlLeagueLogo;

// Merchandise product images
import hatImage from 'figma:asset/74d71ff6afd7598999a0a46d2fe94d341dc31479.png';
import tshirtImage from 'figma:asset/0e686c51ee963c6baba3da1cde0ec9749085a81b.png';
import jerseyImage from 'figma:asset/878c32abc1d04de4852438276c0e84b3db907603.png';
import hoodieImage from 'figma:asset/2b3861a0d4da21cb68ecbba3c4d097606dd028d9.png';
import tradingCardImage from 'figma:asset/385e1435c4a2d46427f79808c5b0a39879ce81dc.png';
import homeJerseyImage from 'figma:asset/5a182ed1226573ace25f3d4e647bcc75cfd60141.png';
import awayJerseyImage from 'figma:asset/9d8002205b243e5646449eed095387dd59122bb0.png';

// Translations
const translations: Record<string, any> = {
  English: {
    welcome: {
      title: "Drop the Puck!",
      subtitle: "Take the NHL Shop NYC survey and catch a",
      discount: "10% discount",
      subtitleEnd: "on your next in-store purchase!",
      selectLanguage: "Select Your Language",
      selectLocation: "Select Your Location",
      chooseLocation: "Choose your location...",
      zipCode: "Zip Code",
      enterZip: "Enter 5-digit zip",
      startSurvey: "Start Survey",
      disclaimer: "The 10% discount is redeemable exclusively at the NHL Shop NYC Flagship store and is valid for thirty days from your purchase date. Please check your email for details on how to redeem your discount. Thank you for participating in the NHL Shop NYC Flagship store survey—your feedback will help us enhance our service to all fans and customers."
    },
    questions: {
      title: "Didn't buy? Tell us why!",
      q1: "Were you able to find what you were looking for?",
      q2: "Are you satisfied with your shopping experience?",
      q3: "Did you interact with any associates today?",
      yes: "Yes",
      no: "No",
      back: "Back",
      continue: "Continue"
    },
    teamSelection: {
      title: "Select Your Team",
      back: "Back",
      continue: "Continue"
    },
    merchandiseSearch: {
      title: "What Were You Looking For?",
      searchPlaceholder: "Search for items...",
      selectCategory: "Select Category",
      chooseCategory: "Choose a category...",
      selectGender: "Select Gender",
      chooseGender: "Choose gender...",
      selectSize: "Select Size",
      chooseSize: "Choose size...",
      selectStyle: "Select Style",
      chooseStyle: "Choose style...",
      addItem: "Add Item",
      customItem: "Add custom item...",
      yourSelections: "Your Selections",
      remove: "Remove",
      back: "Back",
      continue: "Continue"
    },
    outOfStock: {
      title: "We're Sorry",
      message: "The merchandise you wanted is currently out of stock. We're working to have availability again soon.",
      back: "Back",
      continue: "Continue"
    },
    shoppingExperience: {
      title: "What Affected Your Shopping Experience?",
      subtitle: "Please let us know what we can improve",
      options: [
        "I could not find the item I wanted.",
        "The checkout process was difficult.",
        "The wait time was too long.",
        "I needed assistance and did not receive any.",
        "The associate was unfriendly.",
        "Other"
      ],
      otherPlaceholder: "Please specify...",
      back: "Back",
      continue: "Continue"
    },
    associateRating: {
      title: "How Would You Rate Your Associate Interaction?",
      subtitle: "Your feedback helps us improve",
      satisfied: "Satisfied",
      neutral: "Neutral",
      dissatisfied: "Dissatisfied",
      back: "Back",
      continue: "Continue"
    },
    hearAboutStore: {
      title: "How Did You Hear About Our Store?",
      options: [
        "Airport Ads",
        "City Guide",
        "Commercial",
        "Email",
        "LIRR",
        "Penn Station",
        "Playbill",
        "Social",
        "Subway Ads",
        "Taxi Toppers",
        "Time Square Billboard Ads",
        "Walk-ins",
        "Wfan",
        "Other"
      ],
      back: "Back",
      continue: "Continue"
    },
    thankYou: {
      title: "Thank You for Your Feedback!",
      emailPrompt: "Enter your email for 10% off your next in-store purchase.",
      emailPlaceholder: "your.email@example.com",
      notifyCheckbox: "Notify me when out-of-stock items are available",
      submit: "Submit Survey"
    },
    confirmation: {
      title: "Survey Complete!",
      message: "Check your email for your 10% discount code.",
      thankYou: "Thank you for your feedback!"
    }
  },
  Spanish: {
    welcome: {
      title: "¡Prepárate para Batear!",
      subtitle: "Completa la encuesta de NHL Shop NYC y obtén un",
      discount: "10% de descuento",
      subtitleEnd: "en tu próxima compra en la tienda!",
      selectLanguage: "Selecciona Tu Idioma",
      selectLocation: "Selecciona Tu Ubicación",
      chooseLocation: "Elige tu ubicación...",
      zipCode: "Código Postal",
      enterZip: "Ingresa código de 5 dígitos",
      startSurvey: "Iniciar Encuesta",
      disclaimer: "El 10% de descuento es canjeable exclusivamente en la tienda insignia NHL Shop NYC y es válido durante treinta días desde la fecha de compra. Por favor revisa tu correo electrónico para detalles sobre cómo canjear tu descuento. Gracias por participar en la encuesta de la tienda insignia NHL Shop NYC—tu opinión nos ayudará a mejorar nuestro servicio para todos los fanáticos y clientes."
    },
    questions: {
      title: "¿No compraste? ¡Cuéntanos por qué!",
      q1: "¿Pudiste encontrar lo que buscabas?",
      q2: "¿Estás satisfecho con tu experiencia de compra?",
      q3: "¿Interactuaste con algún asociado hoy?",
      yes: "Sí",
      no: "No",
      back: "Atrás",
      continue: "Continuar"
    },
    teamSelection: {
      title: "Selecciona Tu Equipo",
      back: "Atrás",
      continue: "Continuar"
    },
    merchandiseSearch: {
      title: "¿Qué Estabas Buscando?",
      searchPlaceholder: "Buscar artículos...",
      selectCategory: "Seleccionar Categoría",
      chooseCategory: "Elige una categoría...",
      selectGender: "Seleccionar Género",
      chooseGender: "Elige género...",
      selectSize: "Seleccionar Talla",
      chooseSize: "Elige talla...",
      selectStyle: "Seleccionar Estilo",
      chooseStyle: "Elige estilo...",
      addItem: "Agregar Artículo",
      customItem: "Agregar artículo personalizado...",
      yourSelections: "Tus Selecciones",
      remove: "Eliminar",
      back: "Atrás",
      continue: "Continuar"
    },
    outOfStock: {
      title: "Lo Sentimos",
      message: "La mercancía que querías está actualmente agotada. Estamos trabajando para tener disponibilidad nuevamente pronto.",
      back: "Atrás",
      continue: "Continuar"
    },
    shoppingExperience: {
      title: "¿Qué Afectó Tu Experiencia de Compra?",
      subtitle: "Por favor déjanos saber qué podemos mejorar",
      options: [
        "No pude encontrar el artículo que quería.",
        "El proceso de pago fue difícil.",
        "El tiempo de espera fue demasiado largo.",
        "Necesitaba asistencia y no la recibí.",
        "La distribución de la tienda fue confusa.",
        "Otro"
      ],
      otherPlaceholder: "Por favor especifica...",
      back: "Atrás",
      continue: "Continuar"
    },
    associateRating: {
      title: "¿Cómo Calificarías Tu Interacción con el Asociado?",
      subtitle: "Tu opinión nos ayuda a mejorar",
      satisfied: "Satisfecho",
      neutral: "Neutral",
      dissatisfied: "Insatisfecho",
      back: "Atrás",
      continue: "Continuar"
    },
    hearAboutStore: {
      title: "¿Cómo Te Enteraste de Nuestra Tienda?",
      options: [
        "Airport Ads",
        "City Guide",
        "Commercial",
        "Email",
        "LIRR",
        "Penn Station",
        "Playbill",
        "Social",
        "Subway Ads",
        "Taxi Toppers",
        "Time Square Billboard Ads",
        "Walk-ins",
        "Wfan",
        "Otro"
      ],
      back: "Atrás",
      continue: "Continuar"
    },
    thankYou: {
      title: "¡Gracias por Tu Opinión!",
      emailPrompt: "Ingresa tu correo electrónico para obtener un 10% de descuento en tu próxima compra en la tienda.",
      emailPlaceholder: "tu.correo@ejemplo.com",
      notifyCheckbox: "Notifícame cuando los artículos agotados estén disponibles",
      submit: "Enviar Encuesta"
    },
    confirmation: {
      title: "¡Encuesta Completada!",
      message: "Revisa tu correo electrónico para tu código de descuento del 10%.",
      thankYou: "¡Gracias por tu opinión!"
    }
  },
  Korean: {
    welcome: {
      title: "타석에 서세요!",
      subtitle: "NHL Shop NYC 설문조사에 참여하고",
      discount: "10% 할인",
      subtitleEnd: "다음 매장 구매 시 받으세요!",
      selectLanguage: "언어 선택",
      selectLocation: "위치 선택",
      chooseLocation: "위치를 선택하세요...",
      zipCode: "우편번호",
      enterZip: "5자리 우편번호 입력",
      startSurvey: "설문 시작",
      disclaimer: "10% 할인은 NHL Shop NYC 플래그십 스토어에서만 사용 가능하며 구매일로부터 30일간 유효합니다. 할인 사용 방법에 대한 자세한 내용은 이메일을 확인하세요. NHL Shop NYC 플래그십 스토어 설문조사에 참여해 주셔서 감사합니다. 귀하의 의견은 모든 팬과 고객을 위한 서비스 개선에 도움이 됩니다."
    },
    questions: {
      title: "구매하지 않으셨나요? 이유를 알려주세요!",
      q1: "원하시는 것을 찾으셨나요?",
      q2: "쇼핑 경험에 만족하시나요?",
      q3: "오늘 직원과 대화하셨나요?",
      yes: "예",
      no: "아니오",
      back: "뒤로",
      continue: "계속"
    },
    teamSelection: {
      title: "팀 선택",
      back: "뒤로",
      continue: "계속"
    },
    merchandiseSearch: {
      title: "무엇을 찾고 계셨나요?",
      searchPlaceholder: "상품 검색...",
      selectCategory: "카테고리 선택",
      chooseCategory: "카테고리를 선택하세요...",
      selectGender: "성별 선택",
      chooseGender: "성별을 선택하세요...",
      selectSize: "사이즈 선택",
      chooseSize: "사이즈를 선택하세요...",
      selectStyle: "스타일 선택",
      chooseStyle: "스타일을 선택하세요...",
      addItem: "상품 추가",
      customItem: "맞춤 상품 추가...",
      yourSelections: "선택한 상품",
      remove: "제거",
      back: "뒤로",
      continue: "계속"
    },
    outOfStock: {
      title: "죄송합니다",
      message: "원하시는 상품이 현재 품절되었습니다. 곧 재입고될 수 있도록 노력하겠습니다.",
      back: "뒤로",
      continue: "계속"
    },
    shoppingExperience: {
      title: "쇼핑 경험에 영향을 준 요인은?",
      subtitle: "개선할 점을 알려주세요",
      options: [
        "원하는 상품을 찾을 수 없었습니다.",
        "결제 과정이 어려웠습니다.",
        "대기 시간이 너무 길었습니다.",
        "도움이 필요했지만 받지 못했습니다.",
        "매장 구조가 혼란스러웠습니다.",
        "기타"
      ],
      otherPlaceholder: "구체적으로 입력하세요...",
      back: "뒤로",
      continue: "계속"
    },
    associateRating: {
      title: "직원과의 상호작용을 어떻게 평가하시나요?",
      subtitle: "귀하의 의견은 개선에 도움이 됩니다",
      satisfied: "만족",
      neutral: "보통",
      dissatisfied: "불만족",
      back: "뒤로",
      continue: "계속"
    },
    hearAboutStore: {
      title: "우리 매장을 어떻게 알게 되셨나요?",
      options: [
        "Airport Ads",
        "City Guide",
        "Commercial",
        "Email",
        "LIRR",
        "Penn Station",
        "Playbill",
        "Social",
        "Subway Ads",
        "Taxi Toppers",
        "Time Square Billboard Ads",
        "Walk-ins",
        "Wfan",
        "기타"
      ],
      back: "뒤로",
      continue: "계속"
    },
    thankYou: {
      title: "의견 주셔서 감사합니다!",
      emailPrompt: "다음 매장 구매 시 10% 할인을 받으려면 이메일을 입력하세요.",
      emailPlaceholder: "your.email@example.com",
      notifyCheckbox: "품절 상품 재입고 시 알림 받기",
      submit: "설문 제출"
    },
    confirmation: {
      title: "설문 완료!",
      message: "10% 할인 코드는 이메일을 확인하세요.",
      thankYou: "의견 주셔서 감사합니다!"
    }
  },
  Japanese: {
    welcome: {
      title: "プレーボール！",
      subtitle: "NHL Shop NYCアンケートに参加して",
      discount: "10%割引",
      subtitleEnd: "次回店舗購入時にゲット！",
      selectLanguage: "言語を選択",
      selectLocation: "場所を選択",
      chooseLocation: "場所を選択してください...",
      zipCode: "郵便番号",
      enterZip: "5桁の郵便番号を入力",
      startSurvey: "アンケート開始",
      disclaimer: "10%割引はNHL Shop NYCフラッグシップストアでのみ利用可能で、購入日から30日間有効です。割引の利用方法の詳細については、メールをご確認ください。NHL Shop NYCフラッグシップストアのアンケートにご参加いただきありがとうございます。お客様のご意見は、すべてのファンとお客様へのサービス向上に役立ちます。"
    },
    questions: {
      title: "購入しませんでしたか？理由を教えてください！",
      q1: "お探しのものは見つかりましたか？",
      q2: "シ���ッピング体験に満足していますか？",
      q3: "本日スタッフとやり取りしましたか？",
      yes: "はい",
      no: "いいえ",
      back: "戻る",
      continue: "続ける"
    },
    teamSelection: {
      title: "チームを選択",
      back: "戻る",
      continue: "続ける"
    },
    merchandiseSearch: {
      title: "何をお探しでしたか？",
      searchPlaceholder: "商品を検索...",
      selectCategory: "カテゴリーを選択",
      chooseCategory: "カテゴリーを選択してください...",
      selectGender: "性別を選択",
      chooseGender: "性別を選択してください...",
      selectSize: "サイズを選択",
      chooseSize: "サイズを選択してください...",
      selectStyle: "スタイルを選択",
      chooseStyle: "スタイルを選択してください...",
      addItem: "商品を追加",
      customItem: "カスタム商品を追加...",
      yourSelections: "選択した商品",
      remove: "削除",
      back: "戻る",
      continue: "続ける"
    },
    outOfStock: {
      title: "申し訳ございません",
      message: "お探しの商品は現在在庫切れです。近日中に再入荷できるよう努めております。",
      back: "戻る",
      continue: "続ける"
    },
    shoppingExperience: {
      title: "ショッピング体験に影響したことは？",
      subtitle: "改善点を教えてください",
      options: [
        "欲しい商品が見つかりませんでした。",
        "チェックアウトが困難でした。",
        "待ち時間が長すぎました。",
        "サポートが必要でしたが受けられませんでした。",
        "店内のレイアウトがわかりにくかったです。",
        "その他"
      ],
      otherPlaceholder: "詳細を入力してください...",
      back: "戻る",
      continue: "続ける"
    },
    associateRating: {
      title: "スタッフとのやり取りをどう評価しますか？",
      subtitle: "ご意見は改善に役立ちます",
      satisfied: "満足",
      neutral: "普通",
      dissatisfied: "不満",
      back: "戻る",
      continue: "続ける"
    },
    hearAboutStore: {
      title: "当店をどこで知りましたか？",
      options: [
        "Airport Ads",
        "City Guide",
        "Commercial",
        "Email",
        "LIRR",
        "Penn Station",
        "Playbill",
        "Social",
        "Subway Ads",
        "Taxi Toppers",
        "Time Square Billboard Ads",
        "Walk-ins",
        "Wfan",
        "その他"
      ],
      back: "戻る",
      continue: "続ける"
    },
    thankYou: {
      title: "ご意見ありがとうございます！",
      emailPrompt: "次回店舗購入時に10%割引を受けるにはメールアドレスを入力してください。",
      emailPlaceholder: "your.email@example.com",
      notifyCheckbox: "在庫切れ商品の再入荷時に通知を受け取る",
      submit: "アンケート送信"
    },
    confirmation: {
      title: "アンケート完了！",
      message: "10%割引コードはメールをご確認ください。",
      thankYou: "ご意見ありがとうございました！"
    }
  },
  Chinese: {
    welcome: {
      title: "准备击球！",
      subtitle: "参加NHL Shop NYC调查并获得",
      discount: "10%折扣",
      subtitleEnd: "下次店内购买！",
      selectLanguage: "选择语言",
      selectLocation: "选择位置",
      chooseLocation: "选择您的位置...",
      zipCode: "邮政编码",
      enterZip: "输入5位数邮编",
      startSurvey: "开始调查",
      disclaimer: "10%折扣仅可在NHL Shop NYC旗舰店使用，自购买之日起30天内有效。请查看您的电子邮件以了解如何兑换折扣的详细信息。感谢您参加NHL Shop NYC旗舰店调查——您的反馈将帮助我们改进对所有球迷和客户的服务。"
    },
    questions: {
      title: "没有购买？告诉我们原因！",
      q1: "您找到想要的东西了吗？",
      q2: "您对购物体验满意吗？",
      q3: "您今天与员工互动了吗？",
      yes: "是",
      no: "否",
      back: "返回",
      continue: "继续"
    },
    teamSelection: {
      title: "选择您的球队",
      back: "返回",
      continue: "继续"
    },
    merchandiseSearch: {
      title: "您在找什么？",
      searchPlaceholder: "搜索商品...",
      selectCategory: "选择类别",
      chooseCategory: "选择一个类别...",
      selectGender: "选择性别",
      chooseGender: "选择性别...",
      selectSize: "选择尺码",
      chooseSize: "选择尺码...",
      selectStyle: "选择风格",
      chooseStyle: "选择风格...",
      addItem: "添加商品",
      customItem: "添加自定义商品...",
      yourSelections: "您的选择",
      remove: "移除",
      back: "返回",
      continue: "继续"
    },
    outOfStock: {
      title: "抱歉",
      message: "您想要的商品目前缺货。我们正在努力尽快补货。",
      back: "返回",
      continue: "继续"
    },
    shoppingExperience: {
      title: "什么影响了您的购物体验？",
      subtitle: "请告诉我们可以改进的地方",
      options: [
        "我找不到想要的商品。",
        "结账过程困难。",
        "等待时间太长。",
        "我需要帮助但没有得到。",
        "商店布局令人困惑。",
        "其他"
      ],
      otherPlaceholder: "请说明...",
      back: "返回",
      continue: "继续"
    },
    associateRating: {
      title: "您如何评价与员工的互动？",
      subtitle: "您的反馈帮助我们改进",
      satisfied: "满意",
      neutral: "中立",
      dissatisfied: "不满意",
      back: "返回",
      continue: "继续"
    },
    hearAboutStore: {
      title: "您是如何了解我们商店的？",
      options: [
        "Airport Ads",
        "City Guide",
        "Commercial",
        "Email",
        "LIRR",
        "Penn Station",
        "Playbill",
        "Social",
        "Subway Ads",
        "Taxi Toppers",
        "Time Square Billboard Ads",
        "Walk-ins",
        "Wfan",
        "其他"
      ],
      back: "返回",
      continue: "继续"
    },
    thankYou: {
      title: "感谢您的反馈！",
      emailPrompt: "输入您的电子邮件以获得下次店内购买的10%折扣。",
      emailPlaceholder: "your.email@example.com",
      notifyCheckbox: "缺货商品到货时通知我",
      submit: "提交调查"
    },
    confirmation: {
      title: "调查完成！",
      message: "请查看您的电子邮件以获取10%折扣代码。",
      thankYou: "感谢您的反馈！"
    }
  }
};

export function SurveyPageV2() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cityState, setCityState] = useState<{ city: string; state: string } | null>(null);
  const [isLoadingZip, setIsLoadingZip] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'questions' | 'teamSelection' | 'merchandiseSearch' | 'outOfStock' | 'shoppingExperience' | 'associateRating' | 'hearAboutStore' | 'thankYou' | 'confirmation'>('welcome');
  const [screenHistory, setScreenHistory] = useState<Array<'welcome' | 'questions' | 'teamSelection' | 'merchandiseSearch' | 'outOfStock' | 'shoppingExperience' | 'associateRating' | 'hearAboutStore' | 'thankYou' | 'confirmation'>>([]);

  // Survey answers
  const [foundItem, setFoundItem] = useState<boolean | null>(null);
  const [satisfied, setSatisfied] = useState<boolean | null>(null);
  const [interactedWithAssociate, setInteractedWithAssociate] = useState<boolean | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [associateRating, setAssociateRating] = useState<'satisfied' | 'neutral' | 'dissatisfied' | null>(null);
  const [hearAboutStore, setHearAboutStore] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notifyBackInStock, setNotifyBackInStock] = useState<boolean>(false);

  // Merchandise search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('unisex');
  const [selectedSize, setSelectedSize] = useState('m');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedMerchandise, setSelectedMerchandise] = useState<Array<{ item: string; gender: string; size: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customItemText, setCustomItemText] = useState('');

  // Modal for selecting gender/size per item
  const [showGenderSizeModal, setShowGenderSizeModal] = useState(false);
  const [pendingItem, setPendingItem] = useState<string>('');
  const [modalGender, setModalGender] = useState('unisex');
  const [modalSize, setModalSize] = useState('m');

  // Shopping experience issues
  const [experienceIssues, setExperienceIssues] = useState<string[]>([]);
  const [otherIssueText, setOtherIssueText] = useState('');
  const [showOtherModal, setShowOtherModal] = useState(false);

  // Other category description modal
  const [showOtherCategoryModal, setShowOtherCategoryModal] = useState(false);

  // Navigation helpers
  const navigateToScreen = (screen: typeof currentScreen) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    }
  };

  // Get current translation based on selected language
  const t = translations[selectedLanguage] || translations.English;

  // Reset size selection when category changes between hats and other categories
  useEffect(() => {
    if (selectedCategory === 'hats') {
      // If switching to hats category, reset size if it's not a valid hat size
      const validHatSizes = ['osfm', 'l', 's'];
      if (selectedSize && !validHatSizes.includes(selectedSize)) {
        setSelectedSize('');
      }
    } else if (selectedCategory && selectedCategory !== 'hats' && selectedCategory !== 'other') {
      // If switching from hats to another category, reset size if it's a hat-only size
      if (selectedSize === 'osfm') {
        setSelectedSize('');
      }
    }
  }, [selectedCategory]);

  // Auto-restart survey from confirmation screen after 3 seconds
  useEffect(() => {
    if (currentScreen === 'confirmation') {
      const timer = setTimeout(() => {
        // Reset all state to initial values
        setSelectedLanguage('English');
        setSelectedLocation('');
        setZipCode('');
        setCityState(null);
        setIsLoadingZip(false);
        setFoundItem(null);
        setSatisfied(null);
        setInteractedWithAssociate(null);
        setSelectedTeam('');
        setAssociateRating(null);
        setHearAboutStore('');
        setEmail('');
        setNotifyBackInStock(false);
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedGender('unisex');
        setSelectedSize('m');
        setSelectedStyle('');
        setSelectedMerchandise([]);
        setShowSuggestions(false);
        setCustomItemText('');
        setShowGenderSizeModal(false);
        setPendingItem('');
        setModalGender('unisex');
        setModalSize('m');
        setExperienceIssues([]);
        setOtherIssueText('');
        setScreenHistory([]);
        setCurrentScreen('welcome');
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Auto-advance from out of stock screen after 1.5 seconds
  useEffect(() => {
    if (currentScreen === 'outOfStock') {
      const timer = setTimeout(() => {
        if (satisfied === false) {
          navigateToScreen('shoppingExperience');
        } else {
          // Route to another screen or end survey
          console.log('Survey complete or route to next screen');
        }
      }, 1500); // 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentScreen, satisfied]);

  // Generate merchandise inventory - All teams with consistent product offerings
  const teams = ['Bruins', 'Sabres', 'Flames', 'Hurricanes', 'Blackhawks', 'Avalanche', 'Blue Jackets', 'Stars',
                 'Red Wings', 'Oilers', 'Panthers', 'Kings', 'Wild', 'Canadiens', 'Predators', 'Devils',
                 'Islanders', 'Rangers', 'Senators', 'Flyers', 'Penguins', 'Sharks', 'Kraken', 'Blues',
                 'Lightning', 'Maple Leafs', 'Hockey Club', 'Canucks', 'Golden Knights', 'Capitals', 'Jets', 'Ducks'];

  const productTemplates = [
    'Home Jersey', 'Away Jersey', 'Alternate Jersey', 'Authentic Jersey', 'Replica Jersey', 'Player Jersey',
    'Fitted Cap', 'Snapback Hat', 'Trucker Hat', 'Dad Hat', 'Winter Beanie',
    'Logo T-Shirt', 'Graphic T-Shirt', 'Vintage T-Shirt', 'Player T-Shirt',
    'Hoodie', 'Zip-Up Hoodie', 'Pullover Hoodie', 'Crewneck Sweatshirt',
    'Bobblehead', 'Coffee Mug', 'Keychain', 'Backpack', 'Scarf', 'Pin Collection', 'Game Puck'
  ];

  const merchandiseItems: string[] = [];
  teams.forEach(team => {
    productTemplates.forEach(product => {
      merchandiseItems.push(`${team} ${product}`);
    });
  });

  // Get icon for merchandise item based on category
  const getItemIcon = (itemName: string, size: number = 16) => {
    const lowerName = itemName.toLowerCase();

    // Jerseys - differentiate between home and away
    if (lowerName.includes('home') && lowerName.includes('jersey')) {
      return <img src={homeJerseyImage} alt="Home Jersey" style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply' }} />;
    }
    if (lowerName.includes('away') && lowerName.includes('jersey')) {
      return <img src={awayJerseyImage} alt="Away Jersey" style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply' }} />;
    }
    // Generic jersey (fallback)
    if (lowerName.includes('jersey')) {
      return <img src={jerseyImage} alt="Jersey" style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply' }} />;
    }
    // Hats/Caps
    if (lowerName.includes('hat') || lowerName.includes('cap')) {
      return <img src={hatImage} alt="Hat" style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply' }} />;
    }
    // T-Shirts
    if (lowerName.includes('t-shirt') || lowerName.includes('tshirt')) {
      return <img src={tshirtImage} alt="T-Shirt" style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply' }} />;
    }
    // Hoodies/Sweatshirts
    if (lowerName.includes('hoodie') || lowerName.includes('sweatshirt')) {
      return <img src={hoodieImage} alt="Hoodie" style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply' }} />;
    }
    // Trading Cards
    if (lowerName.includes('card') || lowerName.includes('trading')) {
      return <img src={tradingCardImage} alt="Trading Card" style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply' }} />;
    }
    // Coffee Mug
    if (lowerName.includes('mug') || lowerName.includes('coffee')) {
      return <Coffee size={size} className="text-[#374151]" />;
    }
    // Keychain
    if (lowerName.includes('keychain') || lowerName.includes('key')) {
      return <Key size={size} className="text-[#374151]" />;
    }
    // Backpack
    if (lowerName.includes('backpack') || lowerName.includes('bag')) {
      return <Backpack size={size} className="text-[#374151]" />;
    }
    // Bobblehead, Pin Collection, Memorabilia
    if (lowerName.includes('bobblehead') || lowerName.includes('pin') || lowerName.includes('memorabilia')) {
      return <Medal size={size} className="text-[#374151]" />;
    }
    // Default icon for other items
    return <Package size={size} className="text-[#374151]" />;
  };

  // Filter merchandise based on search query
  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) return [];

    // Extract the short team name from the selected NHL team.
    const teamName = selectedTeam.split(' ').pop() || '';

    return merchandiseItems.filter(item => {
      const matchesSearch = item.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeam = item.includes(teamName);
      return matchesSearch && matchesTeam;
    }).slice(0, 10); // Limit to 10 suggestions
  };

  const filteredSuggestions = getFilteredSuggestions();

  const languages = [
    { code: 'English', name: 'English' },
    { code: 'Spanish', name: 'Español' },
    { code: 'Korean', name: '한국어' },
    { code: 'Japanese', name: '日本語' },
    { code: 'Chinese', name: '中文' }
  ];

  const locationsByLanguage: Record<string, string[]> = {
    English: ['United States', 'Canada', 'Mexico', 'United Kingdom', 'Japan', 'South Korea', 'China', 'Other'],
    Spanish: ['Estados Unidos', 'Canadá', 'México', 'Reino Unido', 'Japón', 'Corea del Sur', 'China', 'Otro'],
    Korean: ['미국', '캐나다', '멕시코', '영국', '일본', '한국', '중국', '기타'],
    Japanese: ['アメリカ', 'カナダ', 'メキシコ', 'イギリス', '日本', '韓国', '中国', 'その他'],
    Chinese: ['美国', '加拿大', '墨西哥', '英国', '日本', '韩国', '中国', '其他']
  };

  const locations = locationsByLanguage[selectedLanguage] || locationsByLanguage.English;

  // Fetch city and state from zip code
  const handleZipCodeChange = async (zip: string) => {
    setZipCode(zip);
    setCityState(null);

    // Only proceed if we have a 5-digit zip code
    if (zip.length === 5 && /^\d{5}$/.test(zip)) {
      setIsLoadingZip(true);
      try {
        const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (response.ok) {
          const data = await response.json();
          const place = data.places[0];
          setCityState({
            city: place['place name'],
            state: place['state abbreviation']
          });
        } else {
          setCityState(null);
        }
      } catch (error) {
        console.error('Error fetching zip code data:', error);
        setCityState(null);
      } finally {
        setIsLoadingZip(false);
      }
    }
  };

  // Reset zip code and city/state when location changes
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setZipCode('');
    setCityState(null);
  };

  // Check if selected location is United States (in any language)
  const isUnitedStates = () => {
    const usTranslations = ['United States', 'Estados Unidos', '미국', 'アメリカ', '美国'];
    return usTranslations.includes(selectedLocation);
  };

  // NHL Teams — logos will be updated once team icons are uploaded
  const nhlTeams = [
    { name: 'Anaheim Ducks', abbr: 'ANA', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Boston Bruins', abbr: 'BOS', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Buffalo Sabres', abbr: 'BUF', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Calgary Flames', abbr: 'CGY', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Carolina Hurricanes', abbr: 'CAR', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Chicago Blackhawks', abbr: 'CHI', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Colorado Avalanche', abbr: 'COL', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Columbus Blue Jackets', abbr: 'CBJ', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Dallas Stars', abbr: 'DAL', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Detroit Red Wings', abbr: 'DET', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Edmonton Oilers', abbr: 'EDM', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Florida Panthers', abbr: 'FLA', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Los Angeles Kings', abbr: 'LAK', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Minnesota Wild', abbr: 'MIN', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Montreal Canadiens', abbr: 'MTL', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Nashville Predators', abbr: 'NSH', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'New Jersey Devils', abbr: 'NJD', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'New York Islanders', abbr: 'NYI', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'New York Rangers', abbr: 'NYR', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Ottawa Senators', abbr: 'OTT', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Philadelphia Flyers', abbr: 'PHI', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Pittsburgh Penguins', abbr: 'PIT', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'San Jose Sharks', abbr: 'SJS', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Seattle Kraken', abbr: 'SEA', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'St. Louis Blues', abbr: 'STL', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Tampa Bay Lightning', abbr: 'TBL', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Toronto Maple Leafs', abbr: 'TOR', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Utah Hockey Club', abbr: 'UTA', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Vancouver Canucks', abbr: 'VAN', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Vegas Golden Knights', abbr: 'VGK', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Washington Capitals', abbr: 'WSH', logoSrc: nhlTeamLogoPlaceholder },
    { name: 'Winnipeg Jets', abbr: 'WPG', logoSrc: nhlTeamLogoPlaceholder },
  ];

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#0a0f19] p-8">
      {/* iPad Device Frame */}
      <div className="relative" style={{ perspective: '2000px' }}>
        {/* iPad with podium angle */}
        <div
          className="relative"
          style={{
            transform: 'rotateX(0deg) rotateY(0deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* iPad Frame */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-6 shadow-2xl">
            {/* Screen */}
            <div
              className="relative bg-black rounded-[2rem] overflow-hidden shadow-inner"
              style={{
                width: '1024px',
                height: '768px',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
              }}
            >
              {/* Survey Content */}
              <div
                className="w-full h-full flex items-center justify-center p-12 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(10,15,25,0.65), rgba(10,15,25,0.75)), url(${iceBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/60 via-[#111827]/40 to-[#6B7280]/30"></div>

                {/* Main Survey Card - Landscape Layout */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="bg-white rounded-3xl shadow-2xl p-11 border border-white/50 w-[850px] h-[650px] relative">

                    {/* Jibe Retail Logo - Bottom Right inside white card */}
                    <div className="absolute bottom-3 right-5">
                      <img src={jibeRetailLogo} alt="Jibe Retail" className="h-8 w-auto opacity-30" />
                    </div>

                    {currentScreen === 'welcome' ? (
                      <div className="flex flex-col items-center justify-between h-full">
                        {/* Middle - Main Headline */}
                        <div className="text-center mb-6">
                          {/* NHL Logo */}
                          <div className="mb-4 flex justify-center">
                            <img src={nhlLeagueLogo} alt="NHL" className="h-24 w-auto" />
                          </div>

                          <h2 className="text-3xl font-bold text-[#374151] leading-tight mb-3">
                            {t.welcome.title}
                          </h2>
                          <p className="text-2xl text-slate-700 leading-relaxed">
                            {t.welcome.subtitle}{' '}
                            <span className="text-[#6B7280] font-bold">{t.welcome.discount}</span>{' '}
                            {t.welcome.subtitleEnd}
                          </p>
                        </div>

                        {/* Bottom Section - Form Fields */}
                        <div className="w-full space-y-4" style={{ minHeight: '310px' }}>
                          {/* Language and Location in a row */}
                          <div className="grid grid-cols-2 gap-5">
                            {/* Language Selection */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-2 text-sm">
                                {t.welcome.selectLanguage}
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedLanguage}
                                  onChange={(e) => setSelectedLanguage(e.target.value)}
                                  className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/20 transition-all cursor-pointer shadow-sm"
                                >
                                  {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                      {lang.name}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                              </div>
                            </div>

                            {/* Location Selection */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-2 text-sm">
                                {t.welcome.selectLocation}
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedLocation}
                                  onChange={(e) => handleLocationChange(e.target.value)}
                                  className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all cursor-pointer shadow-sm"
                                >
                                  <option value="">{t.welcome.chooseLocation}</option>
                                  {locations.map((location) => (
                                    <option key={location} value={location}>
                                      {location}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                              </div>
                            </div>
                          </div>

                          {/* Zip Code Input */}
                          <div className="grid grid-cols-2 gap-5 h-[72px]">
                            {isUnitedStates() && (
                              <>
                                <div>
                                  <label className="block text-slate-700 font-semibold mb-2 text-sm">
                                    {t.welcome.zipCode}
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={zipCode}
                                      onChange={(e) => handleZipCodeChange(e.target.value)}
                                      placeholder={t.welcome.enterZip}
                                      maxLength={5}
                                      className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all shadow-sm"
                                    />
                                    {isLoadingZip && (
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.928l3-2.647z"></path>
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* City and State Display */}
                                {cityState && (
                                  <div>
                                    <label className="block text-slate-700 font-semibold mb-2 text-sm">
                                      City, State
                                    </label>
                                    <div className="w-full bg-slate-100 border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 min-h-[44px]">
                                      {`${cityState.city}, ${cityState.state}`}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Start Button */}
                          <button
                            disabled={!selectedLocation || (isUnitedStates() && !cityState)}
                            onClick={() => navigateToScreen('questions')}
                            className="w-full bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-bold text-lg py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {t.welcome.startSurvey}
                          </button>

                          {/* Disclaimer */}
                          <div className="pt-3 border-t border-slate-300">
                            <p className="text-[10px] text-slate-600 leading-relaxed text-center">
                              {t.welcome.disclaimer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : currentScreen === 'questions' ? (
                      <div className="flex flex-col h-full pt-6">
                        {/* Header */}
                        <div className="text-center mb-8">
                          <div className="mb-4 flex justify-center">
                            <img src={nhlLeagueLogo} alt="NHL" className="h-14 w-auto" />
                          </div>
                          <h2 className="text-2xl font-bold text-[#374151] leading-tight">
                            {t.questions.title}
                          </h2>
                        </div>

                        {/* Questions Container - 3 Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-6 px-8 pt-12">
                          {/* Question 1 */}
                          <div className="flex flex-col items-center text-center">
                            <p className="text-base font-semibold text-slate-800 mb-4">
                              {t.questions.q1}
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                              <button
                                onClick={() => setFoundItem(foundItem === true ? null : true)}
                                className={`relative w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                                  foundItem === true
                                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white shadow-md'
                                    : 'bg-white text-slate-700'
                                }`}
                                style={{
                                  border: '2px solid transparent',
                                  backgroundImage: foundItem === true
                                    ? 'linear-gradient(to right, #111827, #6B7280)'
                                    : 'linear-gradient(white, white), linear-gradient(to right, #111827, #6B7280)',
                                  backgroundOrigin: 'border-box',
                                  backgroundClip: foundItem === true ? 'border-box' : 'padding-box, border-box',
                                }}
                              >
                                {t.questions.yes}
                              </button>
                              <button
                                onClick={() => setFoundItem(foundItem === false ? null : false)}
                                className={`relative w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                                  foundItem === false
                                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white shadow-md'
                                    : 'bg-white text-slate-700'
                                }`}
                                style={{
                                  border: '2px solid transparent',
                                  backgroundImage: foundItem === false
                                    ? 'linear-gradient(to right, #111827, #6B7280)'
                                    : 'linear-gradient(white, white), linear-gradient(to right, #111827, #6B7280)',
                                  backgroundOrigin: 'border-box',
                                  backgroundClip: foundItem === false ? 'border-box' : 'padding-box, border-box',
                                }}
                              >
                                {t.questions.no}
                              </button>
                            </div>
                          </div>

                          {/* Question 2 */}
                          <div className="flex flex-col items-center text-center">
                            <p className="text-base font-semibold text-slate-800 mb-4">
                              {t.questions.q2}
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                              <button
                                onClick={() => setSatisfied(satisfied === true ? null : true)}
                                className={`relative w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                                  satisfied === true
                                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white shadow-md'
                                    : 'bg-white text-slate-700'
                                }`}
                                style={{
                                  border: '2px solid transparent',
                                  backgroundImage: satisfied === true
                                    ? 'linear-gradient(to right, #111827, #6B7280)'
                                    : 'linear-gradient(white, white), linear-gradient(to right, #111827, #6B7280)',
                                  backgroundOrigin: 'border-box',
                                  backgroundClip: satisfied === true ? 'border-box' : 'padding-box, border-box',
                                }}
                              >
                                {t.questions.yes}
                              </button>
                              <button
                                onClick={() => setSatisfied(satisfied === false ? null : false)}
                                className={`relative w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                                  satisfied === false
                                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white shadow-md'
                                    : 'bg-white text-slate-700'
                                }`}
                                style={{
                                  border: '2px solid transparent',
                                  backgroundImage: satisfied === false
                                    ? 'linear-gradient(to right, #111827, #6B7280)'
                                    : 'linear-gradient(white, white), linear-gradient(to right, #111827, #6B7280)',
                                  backgroundOrigin: 'border-box',
                                  backgroundClip: satisfied === false ? 'border-box' : 'padding-box, border-box',
                                }}
                              >
                                {t.questions.no}
                              </button>
                            </div>
                          </div>

                          {/* Question 3 */}
                          <div className="flex flex-col items-center text-center">
                            <p className="text-base font-semibold text-slate-800 mb-4">
                              {t.questions.q3}
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                              <button
                                onClick={() => setInteractedWithAssociate(interactedWithAssociate === true ? null : true)}
                                className={`relative w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                                  interactedWithAssociate === true
                                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white shadow-md'
                                    : 'bg-white text-slate-700'
                                }`}
                                style={{
                                  border: '2px solid transparent',
                                  backgroundImage: interactedWithAssociate === true
                                    ? 'linear-gradient(to right, #111827, #6B7280)'
                                    : 'linear-gradient(white, white), linear-gradient(to right, #111827, #6B7280)',
                                  backgroundOrigin: 'border-box',
                                  backgroundClip: interactedWithAssociate === true ? 'border-box' : 'padding-box, border-box',
                                }}
                              >
                                {t.questions.yes}
                              </button>
                              <button
                                onClick={() => setInteractedWithAssociate(interactedWithAssociate === false ? null : false)}
                                className={`relative w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                                  interactedWithAssociate === false
                                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white shadow-md'
                                    : 'bg-white text-slate-700'
                                }`}
                                style={{
                                  border: '2px solid transparent',
                                  backgroundImage: interactedWithAssociate === false
                                    ? 'linear-gradient(to right, #111827, #6B7280)'
                                    : 'linear-gradient(white, white), linear-gradient(to right, #111827, #6B7280)',
                                  backgroundOrigin: 'border-box',
                                  backgroundClip: interactedWithAssociate === false ? 'border-box' : 'padding-box, border-box',
                                }}
                              >
                                {t.questions.no}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-8 px-12">
                          <button
                            onClick={navigateBack}
                            className="px-10 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
                          >
                            {t.questions.back}
                          </button>
                          <button
                            disabled={foundItem === null || satisfied === null || interactedWithAssociate === null}
                            onClick={() => {
                              if (foundItem === false) {
                                navigateToScreen('teamSelection');
                              } else if (foundItem === true && satisfied === true && interactedWithAssociate === true) {
                                // All Yes - go directly to associate rating screen
                                navigateToScreen('associateRating');
                              } else if (foundItem === true && satisfied === true && interactedWithAssociate === false) {
                                // Skip to hear about store screen
                                navigateToScreen('hearAboutStore');
                              } else if (foundItem === true && satisfied === false && interactedWithAssociate === true) {
                                // Yes, No, Yes - skip team/merch, go to shopping experience screen
                                navigateToScreen('shoppingExperience');
                              } else if (foundItem === true && satisfied === false && interactedWithAssociate === false) {
                                // Yes, No, No - skip team/merch, go to shopping experience screen (then to hear about store)
                                navigateToScreen('shoppingExperience');
                              } else {
                                // Handle continue to next screen
                                console.log('Continue to next screen');
                              }
                            }}
                            className="px-10 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {t.questions.continue}
                          </button>
                        </div>
                      </div>
                    ) : currentScreen === 'teamSelection' ? (
                      <div className="flex flex-col h-full pt-6">
                        {/* Header */}
                        <div className="text-center mb-4">
                          {/* NHL Shop NYC Logo */}
                          <div className="mb-4 flex justify-center">
                            <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-14 w-auto" />
                          </div>
                          <h2 className="text-xl font-bold text-[#374151] leading-tight">
                            {t.teamSelection.title}
                          </h2>
                        </div>

                        {/* Team Selection Grid - Scrollable */}
                        <div className="flex-1 px-8 flex items-center justify-center">
                          <div className="grid grid-cols-6 gap-2 max-w-4xl">
                            {nhlTeams.map((team) => (
                              <button
                                key={team.name}
                                onClick={() => setSelectedTeam(selectedTeam === team.name ? '' : team.name)}
                                className={`relative w-24 h-16 rounded-lg transition-all flex items-center justify-center p-1 ${
                                  selectedTeam === team.name
                                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] shadow-lg scale-105'
                                    : 'bg-white shadow-sm hover:shadow-md'
                                }`}
                                style={
                                  selectedTeam !== team.name
                                    ? {
                                        border: '2px solid transparent',
                                        backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #111827, #6B7280)',
                                        backgroundOrigin: 'border-box',
                                        backgroundClip: 'padding-box, border-box',
                                      }
                                    : undefined
                                }
                                title={team.name}
                              >
                                <img
                                  src={team.logoSrc}
                                  alt={team.name}
                                  className="max-w-[70%] max-h-[70%] object-contain"
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-4 px-12">
                          <button
                            onClick={navigateBack}
                            className="px-10 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
                          >
                            {t.teamSelection.back}
                          </button>
                          <button
                            disabled={!selectedTeam}
                            onClick={() => navigateToScreen('merchandiseSearch')}
                            className="px-10 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {t.teamSelection.continue}
                          </button>
                        </div>
                      </div>
                    ) : currentScreen === 'merchandiseSearch' ? (
                      <div className="flex flex-col h-full pt-6">
                        {/* Header */}
                        <div className="text-center mb-3">
                          {/* NHL Shop NYC Logo */}
                          <div className="mb-3 flex justify-center">
                            <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-14 w-auto" />
                          </div>
                          <h2 className="text-xl font-bold text-[#374151] leading-tight">
                            {t.merchandiseSearch.title}
                          </h2>
                        </div>

                        {/* Search Bar + Team Logo */}
                        <div className="px-8 mb-3">
                          <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                            {/* Search Bar */}
                            <div className="relative">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                  }}
                                  onFocus={() => setShowSuggestions(true)}
                                  placeholder={t.merchandiseSearch.searchPlaceholder}
                                  className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-xl px-12 py-3 text-base text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all shadow-sm"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                                {searchQuery && (
                                  <button
                                    onClick={() => {
                                      setSearchQuery('');
                                      setShowSuggestions(false);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  >
                                    <X size={20} />
                                  </button>
                                )}
                              </div>

                              {/* Suggestions Dropdown */}
                              {showSuggestions && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
                                  {filteredSuggestions.map((item, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (selectedMerchandise.length < 4 && !selectedMerchandise.some(m => m.item === item)) {
                                          setPendingItem(item);
                                          setModalGender('unisex');
                                          setModalSize('m');
                                          setShowGenderSizeModal(true);
                                        }
                                        setSearchQuery('');
                                        setShowSuggestions(false);
                                      }}
                                      className="w-full text-left px-4 py-3 hover:bg-slate-100 transition-colors border-b border-slate-200 last:border-b-0"
                                    >
                                      <div className="font-medium text-slate-800">{item}</div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Team Logo */}
                            {selectedTeam && (
                              <div className="flex items-center justify-center w-[120px] h-[52px]">
                                <img
                                  src={nhlTeams.find(team => team.name === selectedTeam)?.logoSrc}
                                  alt={selectedTeam}
                                  className="h-12 w-auto object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Filters + Add Button */}
                        <div className="flex-1 px-8">
                          <div className="grid grid-cols-5 gap-3 mb-4">
                            {/* Category */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                Category
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedCategory}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedCategory(value);
                                    if (value === 'other') {
                                      setShowOtherCategoryModal(true);
                                    }
                                  }}
                                  className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all cursor-pointer shadow-sm"
                                >
                                  <option value="">All Categories</option>
                                  <option value="hats">Hats</option>
                                  <option value="jerseys">Jerseys</option>
                                  <option value="sweatshirts">Sweatshirts</option>
                                  <option value="tshirts">T-Shirts</option>
                                  <option value="cards">Trading Cards</option>
                                  <option value="novelty">Novelty Items</option>
                                  <option value="memorabilia">Memorabilia</option>
                                  <option value="accessories">Accessories</option>
                                  <option value="other">Other</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                              </div>
                            </div>

                            {/* Gender */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                Gender
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedGender}
                                  onChange={(e) => setSelectedGender(e.target.value)}
                                  className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all cursor-pointer shadow-sm"
                                >
                                  <option value="">All Genders</option>
                                  <option value="men">Men</option>
                                  <option value="women">Women</option>
                                  <option value="youth">Youth</option>
                                  <option value="unisex">Unisex</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                              </div>
                            </div>

                            {/* Size */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                Size
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedSize}
                                  onChange={(e) => setSelectedSize(e.target.value)}
                                  className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all cursor-pointer shadow-sm"
                                >
                                  <option value="">All Sizes</option>
                                  {selectedCategory === 'hats' ? (
                                    <>
                                      <option value="osfm">OSFM</option>
                                      <option value="l">L</option>
                                      <option value="s">S</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="xs">XS</option>
                                      <option value="s">S</option>
                                      <option value="m">M</option>
                                      <option value="l">L</option>
                                      <option value="xl">XL</option>
                                      <option value="xxl">XXL</option>
                                      <option value="xxxl">XXXL</option>
                                    </>
                                  )}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                              </div>
                            </div>

                            {/* Style */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                Style
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedStyle}
                                  onChange={(e) => setSelectedStyle(e.target.value)}
                                  className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all cursor-pointer shadow-sm"
                                >
                                  <option value="">Select Style</option>
                                  <option value="replica">Replica</option>
                                  <option value="authentic">Authentic</option>
                                  <option value="vintage">Vintage</option>
                                  <option value="modern">Modern</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                              </div>
                            </div>

                            {/* Add Item Button */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs opacity-0">
                                Add
                              </label>
                              <button
                                onClick={() => {
                                  if (selectedMerchandise.length >= 4) {
                                    return; // Limit to 4 items
                                  }
                                // For "Other" category, open modal
                                if (selectedCategory === 'other') {
                                  setShowOtherCategoryModal(true);
                                  return;
                                } else if (selectedCategory && selectedCategory !== 'other' && selectedTeam) {
                                  // Extract the short team name from the selected NHL team.
                                  const teamName = selectedTeam.split(' ').pop() || selectedTeam;

                                  // Create item name from team and category
                                  let itemName = '';
                                  if (selectedCategory === 'hats') {
                                    itemName = `${teamName} Fitted Hat`;
                                  } else if (selectedCategory === 'jerseys') {
                                    itemName = `${teamName} Jersey`;
                                  } else if (selectedCategory === 'sweatshirts') {
                                    itemName = `${teamName} Hoodie`;
                                  } else if (selectedCategory === 'tshirts') {
                                    itemName = `${teamName} T-Shirt`;
                                  } else if (selectedCategory === 'cards') {
                                    itemName = `${teamName} Trading Cards`;
                                  } else if (selectedCategory === 'novelty') {
                                    itemName = `${teamName} Novelty Item`;
                                  } else if (selectedCategory === 'memorabilia') {
                                    itemName = `${teamName} Memorabilia`;
                                  } else if (selectedCategory === 'accessories') {
                                    itemName = `${teamName} Accessory`;
                                  }

                                  // Add style if selected
                                  if (selectedStyle && selectedStyle !== '') {
                                    const styleText = selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1);
                                    itemName = `${teamName} ${styleText} ${itemName.split(' ').slice(1).join(' ')}`;
                                  }

                                  // Check if item already exists
                                  if (!selectedMerchandise.some(m => m.item === itemName)) {
                                    setSelectedMerchandise([...selectedMerchandise, {
                                      item: itemName,
                                      gender: selectedGender,
                                      size: selectedSize
                                    }]);
                                  }
                                }
                              }}
                                disabled={
                                  selectedMerchandise.length >= 4 ||
                                  (selectedCategory === 'other'
                                    ? false
                                    : !selectedCategory || !selectedTeam ||
                                      // For items that require gender, size, and style, ensure they are selected
                                      (['hats', 'jerseys', 'tshirts', 'sweatshirts'].includes(selectedCategory) && (!selectedGender || !selectedSize || !selectedStyle)))
                                }
                                className="w-full px-3 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                              >
                                Add Item
                              </button>
                            </div>
                          </div>

                          {/* Selected Items Display */}
                          {selectedMerchandise.length > 0 && (
                            <div className="flex-1 flex items-center justify-center mb-4">
                              <div className="flex gap-6 max-w-full justify-center">
                                {selectedMerchandise.map((merchandiseItem, index) => (
                                  <div key={index} className="relative w-[200px]">
                                    <div className="flex flex-col items-center p-6 rounded-2xl transition-all bg-white/90 border-2 border-slate-300 hover:border-[#111827]">
                                      <div className="w-[130px] h-[130px] rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-3 border-slate-300 flex items-center justify-center p-4">
                                        {getItemIcon(merchandiseItem.item, 90)}
                                      </div>
                                      <p className="mt-4 font-bold text-base text-[#374151] text-center leading-tight mb-3 line-clamp-2 min-h-[40px]">
                                        {merchandiseItem.item}
                                      </p>

                                      {/* Gender & Size Badges */}
                                      <div className="flex gap-2 flex-wrap justify-center">
                                        {merchandiseItem.gender && (
                                          <span className="px-3 py-1 bg-[#111827] text-white text-xs font-semibold rounded-full">
                                            {merchandiseItem.gender.charAt(0).toUpperCase() + merchandiseItem.gender.slice(1)}
                                          </span>
                                        )}
                                        {merchandiseItem.size && (
                                          <span className="px-3 py-1 bg-[#6B7280] text-white text-xs font-semibold rounded-full">
                                            {merchandiseItem.size.toUpperCase()}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                      onClick={() => {
                                        setSelectedMerchandise(selectedMerchandise.filter((_, i) => i !== index));
                                      }}
                                      className="absolute -top-2 -right-2 bg-[#6B7280] hover:bg-[#4B5563] text-white rounded-full p-1.5 transition-colors shadow-lg"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Gender/Size Selection Modal */}
                          {showGenderSizeModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => setShowGenderSizeModal(false)}>
                              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                                <h3 className="text-2xl font-bold text-[#374151] mb-2">Select Details</h3>
                                <p className="text-slate-600 mb-6">Choose gender and size for:</p>
                                <p className="font-bold text-lg text-[#374151] mb-6">{pendingItem}</p>

                                <div className="space-y-4 mb-6">
                                  {/* Gender Selection */}
                                  <div>
                                    <label className="block text-slate-700 font-semibold mb-2">
                                      Gender
                                    </label>
                                    <select
                                      value={modalGender}
                                      onChange={(e) => setModalGender(e.target.value)}
                                      className="w-full appearance-none bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all cursor-pointer"
                                    >
                                      <option value="men">Men</option>
                                      <option value="women">Women</option>
                                      <option value="youth">Youth</option>
                                      <option value="unisex">Unisex</option>
                                    </select>
                                  </div>

                                  {/* Size Selection */}
                                  <div>
                                    <label className="block text-slate-700 font-semibold mb-2">
                                      Size
                                    </label>
                                    <select
                                      value={modalSize}
                                      onChange={(e) => setModalSize(e.target.value)}
                                      className="w-full appearance-none bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all cursor-pointer"
                                    >
                                      <option value="xs">XS</option>
                                      <option value="s">S</option>
                                      <option value="m">M</option>
                                      <option value="l">L</option>
                                      <option value="xl">XL</option>
                                      <option value="xxl">XXL</option>
                                      <option value="xxxl">XXXL</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Modal Buttons */}
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => setShowGenderSizeModal(false)}
                                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedMerchandise([...selectedMerchandise, {
                                        item: pendingItem,
                                        gender: modalGender,
                                        size: modalSize
                                      }]);
                                      setShowGenderSizeModal(false);
                                      setPendingItem('');
                                    }}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                                  >
                                    Add Item
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-2 px-12">
                          <button
                            onClick={navigateBack}
                            className="px-10 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
                          >
                            Back
                          </button>
                          <button
                            disabled={
                              selectedMerchandise.length === 0 ||
                              selectedMerchandise.some(item => {
                                const requiresGenderSize =
                                  item.item.toLowerCase().includes('hat') ||
                                  item.item.toLowerCase().includes('jersey') ||
                                  item.item.toLowerCase().includes('t-shirt') ||
                                  item.item.toLowerCase().includes('tshirt') ||
                                  item.item.toLowerCase().includes('sweatshirt') ||
                                  item.item.toLowerCase().includes('hoodie');
                                return requiresGenderSize && (!item.gender || !item.size);
                              })
                            }
                            onClick={() => {
                              // If customer didn't find item (foundItem === false), is satisfied (satisfied === true),
                              // and interacted with associate (interactedWithAssociate === true),
                              // skip the "what affected your shopping" screen and go directly to associate rating
                              if (foundItem === false && satisfied === true && interactedWithAssociate === true) {
                                navigateToScreen('associateRating');
                              } else if (foundItem === false && satisfied === true && interactedWithAssociate === false) {
                                // If Q1=No, Q2=Yes, Q3=No, go directly to hear about store screen
                                navigateToScreen('hearAboutStore');
                              } else {
                                navigateToScreen('outOfStock');
                              }
                            }}
                            className="px-10 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Out of Stock Message Screen */}
                    {currentScreen === 'outOfStock' ? (
                      <div className="flex flex-col h-full px-12 pt-6 pb-4">
                        {/* NHL Shop NYC Logo */}
                        <div className="mb-4 flex justify-center">
                          <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-14 w-auto" />
                        </div>

                        {/* Message Content - Centered */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                          <h2 className="text-4xl font-bold text-[#374151] mb-8">
                            {t.outOfStock.title}
                          </h2>
                          <p className="text-2xl text-slate-700 leading-relaxed">
                            {t.outOfStock.message}
                          </p>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-4">
                          <button
                            onClick={navigateBack}
                            className="px-10 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
                          >
                            {t.outOfStock.back}
                          </button>
                          <button
                            onClick={() => {
                              if (satisfied === false) {
                                navigateToScreen('shoppingExperience');
                              } else {
                                // Route to another screen or end survey
                                console.log('Survey complete or route to next screen');
                              }
                            }}
                            className="px-10 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {t.outOfStock.continue}
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Shopping Experience Screen */}
                    {currentScreen === 'shoppingExperience' ? (
                      <div className="flex flex-col h-full px-12 pt-6 pb-4">
                        {/* NHL Shop NYC Logo */}
                        <div className="mb-4 flex justify-center">
                          <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-14 w-auto" />
                        </div>

                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-[#374151] text-center mb-2">
                            {t.shoppingExperience.title}
                          </h2>
                          <p className="text-sm text-slate-600 text-center">
                            {t.shoppingExperience.subtitle}
                          </p>
                        </div>

                        {/* Options Grid */}
                        <div className="flex-1 px-4 mb-4">
                          <div className="grid grid-cols-3 gap-3 max-w-4xl mx-auto">
                            {t.shoppingExperience.options.slice(0, 5).map((issue: string) => (
                              <button
                                key={issue}
                                onClick={() => {
                                  if (experienceIssues.includes(issue)) {
                                    setExperienceIssues(experienceIssues.filter(i => i !== issue));
                                  } else {
                                    setExperienceIssues([...experienceIssues, issue]);
                                  }
                                }}
                                className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all min-h-[125px] border ${
                                  experienceIssues.includes(issue)
                                    ? 'bg-gradient-to-br from-[#111827] to-[#6B7280] text-white border-transparent scale-105 shadow-xl'
                                    : 'bg-white text-slate-700 border-[#111827]/30 hover:scale-105 hover:border-[#6B7280]'
                                }`}
                              >
                                  <div className={`text-4xl mb-2 ${
                                    experienceIssues.includes(issue) ? 'opacity-100' : 'opacity-70'
                                  }`}>
                                    {issue.includes('could not find') ? '🤷' :
                                     issue.includes('checkout') ? '🌀' :
                                     issue.includes('wait time') ? '⏱️' :
                                     issue.includes('assistance') ? '🙋' :
                                     issue.includes('unfriendly') ? '😲' : '❓'}
                                  </div>
                                <p className={`font-semibold text-center text-xs leading-tight ${
                                  experienceIssues.includes(issue) ? 'text-white' : 'text-[#374151]'
                                }`}>
                                  {issue}
                                </p>
                              </button>
                            ))}

                            {/* Other option with modal */}
                            <div className="relative">
                              <button
                                onClick={() => {
                                  setShowOtherModal(true);
                                }}
                                className={`w-full flex flex-col items-center justify-center p-5 rounded-2xl transition-all min-h-[125px] border ${
                                  experienceIssues.includes('Other')
                                    ? 'bg-gradient-to-br from-[#111827] to-[#6B7280] text-white border-transparent scale-105 shadow-xl'
                                    : 'bg-white text-slate-700 border-[#111827]/30 hover:scale-105 hover:border-[#6B7280]'
                                }`}
                              >
                                  <div className={`text-4xl mb-2 ${
                                    experienceIssues.includes('Other') ? 'opacity-100' : 'opacity-70'
                                  }`}>
                                    ✏️
                                  </div>
                                <p className={`font-semibold text-center text-xs ${
                                  experienceIssues.includes('Other') ? 'text-white' : 'text-[#374151]'
                                }`}>
                                  Other
                                </p>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-2">
                          <button
                            onClick={navigateBack}
                            className="px-10 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
                          >
                            Back
                          </button>
                          <button
                            disabled={experienceIssues.length === 0}
                            onClick={() => {
                              if (interactedWithAssociate === true) {
                                navigateToScreen('associateRating');
                              } else {
                                // If Q3=No, go to hear about store screen
                                navigateToScreen('hearAboutStore');
                              }
                            }}
                            className="px-10 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Associate Rating Screen */}
                    {currentScreen === 'associateRating' ? (
                      <div className="flex flex-col h-full px-12 pt-6 pb-6">
                        {/* NHL Shop NYC Logo */}
                        <div className="mb-4 flex justify-center">
                          <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-14 w-auto" />
                        </div>

                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-[#374151] text-center mb-2">
                            {t.associateRating.title}
                          </h2>
                          <p className="text-sm text-slate-600 text-center">
                            {t.associateRating.subtitle}
                          </p>
                        </div>

                        {/* Face Options */}
                        <div className="flex-1 flex items-center justify-center mb-6">
                          <div className="flex gap-8 max-w-3xl justify-center">
                            {/* Satisfied Face */}
                            <button
                              onClick={() => setAssociateRating(associateRating === 'satisfied' ? null : 'satisfied')}
                              className={`flex flex-col items-center p-6 rounded-2xl transition-all ${
                                associateRating === 'satisfied'
                                  ? 'bg-[#22C55E] scale-110 shadow-xl'
                                  : 'bg-white/90 border-2 border-slate-300 hover:border-[#111827] hover:scale-105'
                              }`}
                            >
                              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <circle cx="60" cy="60" r="55" fill={associateRating === 'satisfied' ? '#fff' : '#22C55E'} stroke={associateRating === 'satisfied' ? '#fff' : '#16A34A'} strokeWidth="3"/>
                                <circle cx="42" cy="50" r="6" fill={associateRating === 'satisfied' ? '#16A34A' : '#16A34A'}/>
                                <circle cx="78" cy="50" r="6" fill={associateRating === 'satisfied' ? '#16A34A' : '#16A34A'}/>
                                <path d="M 35 70 Q 60 90 85 70" stroke={associateRating === 'satisfied' ? '#16A34A' : '#16A34A'} strokeWidth="4" strokeLinecap="round" fill="none"/>
                              </svg>
                              <p className={`mt-4 font-bold text-lg ${associateRating === 'satisfied' ? 'text-white' : 'text-[#374151]'}`}>
                                {t.associateRating.satisfied}
                              </p>
                            </button>

                            {/* Neutral Face */}
                            <button
                              onClick={() => setAssociateRating(associateRating === 'neutral' ? null : 'neutral')}
                              className={`flex flex-col items-center p-6 rounded-2xl transition-all ${
                                associateRating === 'neutral'
                                  ? 'bg-slate-500 scale-110 shadow-xl'
                                  : 'bg-white/90 border-2 border-slate-300 hover:border-[#111827] hover:scale-105'
                              }`}
                            >
                              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <circle cx="60" cy="60" r="55" fill={associateRating === 'neutral' ? '#fff' : '#F59E0B'} stroke={associateRating === 'neutral' ? '#fff' : '#D97706'} strokeWidth="3"/>
                                <circle cx="42" cy="50" r="6" fill={associateRating === 'neutral' ? '#64748B' : '#D97706'}/>
                                <circle cx="78" cy="50" r="6" fill={associateRating === 'neutral' ? '#64748B' : '#D97706'}/>
                                <line x1="40" y1="75" x2="80" y2="75" stroke={associateRating === 'neutral' ? '#64748B' : '#D97706'} strokeWidth="4" strokeLinecap="round"/>
                              </svg>
                              <p className={`mt-4 font-bold text-lg ${associateRating === 'neutral' ? 'text-white' : 'text-[#374151]'}`}>
                                {t.associateRating.neutral}
                              </p>
                            </button>

                            {/* Dissatisfied Face */}
                            <button
                              onClick={() => setAssociateRating(associateRating === 'dissatisfied' ? null : 'dissatisfied')}
                              className={`flex flex-col items-center p-6 rounded-2xl transition-all ${
                                associateRating === 'dissatisfied'
                                  ? 'bg-[#6B7280] scale-110 shadow-xl'
                                  : 'bg-white/90 border-2 border-slate-300 hover:border-[#111827] hover:scale-105'
                              }`}
                            >
                              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <circle cx="60" cy="60" r="55" fill={associateRating === 'dissatisfied' ? '#fff' : '#EF4444'} stroke={associateRating === 'dissatisfied' ? '#fff' : '#DC2626'} strokeWidth="3"/>
                                <circle cx="42" cy="50" r="6" fill={associateRating === 'dissatisfied' ? '#DC2626' : '#DC2626'}/>
                                <circle cx="78" cy="50" r="6" fill={associateRating === 'dissatisfied' ? '#DC2626' : '#DC2626'}/>
                                <path d="M 35 85 Q 60 65 85 85" stroke={associateRating === 'dissatisfied' ? '#DC2626' : '#DC2626'} strokeWidth="4" strokeLinecap="round" fill="none"/>
                              </svg>
                              <p className={`mt-4 font-bold text-lg ${associateRating === 'dissatisfied' ? 'text-white' : 'text-[#374151]'}`}>
                                {t.associateRating.dissatisfied}
                              </p>
                            </button>
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-2">
                          <button
                            onClick={navigateBack}
                            className="px-10 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
                          >
                            Back
                          </button>
                          <button
                            disabled={!associateRating}
                            onClick={() => navigateToScreen('hearAboutStore')}
                            className="px-10 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* How Did You Hear About Our Store Screen */}
                    {currentScreen === 'hearAboutStore' ? (
                      <div className="flex flex-col h-full px-12 pt-5 pb-4">
                        {/* NHL Shop NYC Logo */}
                        <div className="mb-3 flex justify-center">
                          <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-12 w-auto" />
                        </div>

                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-[#374151] text-center">
                            {t.hearAboutStore.title}
                          </h2>
                        </div>

                        {/* Options Grid */}
                        <div className="flex-1 px-4 mb-2">
                          <div className="grid grid-cols-2 gap-2 max-w-3xl mx-auto">
                            {t.hearAboutStore.options.map((option: string) => (
                              <button
                                key={option}
                                onClick={() => setHearAboutStore(hearAboutStore === option ? '' : option)}
                                className={`py-2 px-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                                  hearAboutStore === option
                                    ? 'border-[#6B7280] bg-gradient-to-r from-[#111827] to-[#6B7280] text-white'
                                    : 'border-slate-300 bg-white/90 text-slate-700 hover:border-[#111827]'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-2">
                          <button
                            onClick={navigateBack}
                            className="px-10 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
                          >
                            {t.hearAboutStore.back}
                          </button>
                          <button
                            disabled={!hearAboutStore}
                            onClick={() => navigateToScreen('thankYou')}
                            className="px-10 py-2 bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {t.hearAboutStore.continue}
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Thank You Screen */}
                    {currentScreen === 'thankYou' ? (
                      <div className="flex flex-col h-full px-12 pt-6 pb-8">
                        {/* NHL Shop NYC Logo */}
                        <div className="mb-4 flex justify-center">
                          <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-14 w-auto" />
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="max-w-2xl w-full text-center">
                            <h2 className="text-3xl font-bold text-[#374151] mb-4">
                              {t.thankYou.title}
                            </h2>
                            <p className="text-xl text-slate-700 mb-8">
                              {t.thankYou.emailPrompt}
                            </p>

                            {/* Email Input */}
                            <div className="mb-4">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.thankYou.emailPlaceholder}
                                className="w-full appearance-none bg-white/90 border-2 border-slate-300 rounded-xl px-5 py-4 text-base text-slate-800 focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all shadow-sm"
                              />
                            </div>

                            {/* Notify Checkbox */}
                            <div className="mb-6 flex items-center justify-center">
                              <label className="flex items-center cursor-pointer group">
                                <div
                                  onClick={() => setNotifyBackInStock(!notifyBackInStock)}
                                  className={`w-6 h-6 border-2 rounded transition-all mr-3 flex items-center justify-center ${
                                    notifyBackInStock
                                      ? 'bg-[#6B7280] border-[#6B7280]'
                                      : 'bg-white border-slate-300 group-hover:border-[#111827]'
                                  }`}
                                >
                                  {notifyBackInStock && (
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-base text-slate-700">
                                  {t.thankYou.notifyCheckbox}
                                </span>
                              </label>
                            </div>

                            {/* Submit Button */}
                            <button
                              disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                              onClick={() => {
                                console.log('Survey submitted with email:', email);
                                setCurrentScreen('confirmation');
                              }}
                              className="w-full bg-gradient-to-r from-[#111827] to-[#6B7280] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              {t.thankYou.submit}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Confirmation Screen */}
                    {currentScreen === 'confirmation' ? (
                      <div className="flex flex-col h-full px-12 py-8">
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="max-w-2xl w-full text-center">
                            {/* NHL Shop NYC Logo */}
                            <div className="mb-8 flex justify-center">
                              <img src={nhlShopLogo} alt="NHL Shop NYC" className="h-20 w-auto" />
                            </div>

                            <h2 className="text-4xl font-bold text-[#374151] mb-6">
                              {t.confirmation.title}
                            </h2>
                            <p className="text-2xl text-slate-700">
                              {t.confirmation.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Podium shadow */}
        </div>
      </div>

      {/* Other Issue Modal */}
      {showOtherModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowOtherModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#374151]">
                {t.shoppingExperience.otherPlaceholder}
              </h3>
              <button
                onClick={() => setShowOtherModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <textarea
              value={otherIssueText}
              onChange={(e) => {
                const value = e.target.value.slice(0, 200);
                setOtherIssueText(value);
              }}
              maxLength={200}
              placeholder={t.shoppingExperience.otherPlaceholder}
              className="w-full h-32 p-3 rounded-lg border-2 border-slate-300 bg-white focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all text-sm resize-none"
              autoFocus
            />

            <div className="text-xs text-slate-500 mt-2 mb-4">
              {otherIssueText.length}/200 characters
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOtherIssueText('');
                  setExperienceIssues(experienceIssues.filter(i => i !== 'Other'));
                  setShowOtherModal(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (otherIssueText.trim()) {
                    if (!experienceIssues.includes('Other')) {
                      setExperienceIssues([...experienceIssues, 'Other']);
                    }
                    setShowOtherModal(false);
                  }
                }}
                disabled={!otherIssueText.trim()}
                className={`flex-1 px-4 py-2 font-semibold text-sm rounded-lg transition-all ${
                  otherIssueText.trim()
                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white hover:shadow-lg'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Category Description Modal */}
      {showOtherCategoryModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setCustomItemText('');
            setSelectedCategory('');
            setShowOtherCategoryModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#374151]">
                Describe the Item
              </h3>
              <button
                onClick={() => {
                  setCustomItemText('');
                  setSelectedCategory('');
                  setShowOtherCategoryModal(false);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Please describe what you were looking for in detail.
            </p>

            <textarea
              value={customItemText}
              onChange={(e) => {
                const value = e.target.value.slice(0, 200);
                setCustomItemText(value);
              }}
              maxLength={200}
              placeholder="Type what you were looking for..."
              className="w-full h-32 p-3 rounded-lg border-2 border-slate-300 bg-white focus:outline-none focus:border-[#6B7280] focus:ring-2 focus:ring-[#6B7280]/20 transition-all text-sm resize-none"
              autoFocus
            />

            <div className="text-xs text-slate-500 mt-2 mb-4">
              {customItemText.length}/200 characters
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCustomItemText('');
                  setSelectedCategory('');
                  setShowOtherCategoryModal(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customItemText.trim()) {
                    const itemName = customItemText.trim();

                    // Check if item already exists
                    if (!selectedMerchandise.some(m => m.item === itemName)) {
                      setSelectedMerchandise([...selectedMerchandise, {
                        item: itemName,
                        gender: selectedGender,
                        size: selectedSize
                      }]);
                    }
                    setCustomItemText('');
                    setShowOtherCategoryModal(false);
                  }
                }}
                disabled={!customItemText.trim()}
                className={`flex-1 px-4 py-2 font-semibold text-sm rounded-lg transition-all ${
                  customItemText.trim()
                    ? 'bg-gradient-to-r from-[#111827] to-[#6B7280] text-white hover:shadow-lg'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
