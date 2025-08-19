document.addEventListener('DOMContentLoaded', function() {
    // === DOM Elements ===
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const messageModal = document.getElementById('message-modal');
    const messageModalText = document.getElementById('message-modal-text');
    const messageModalClose = document.getElementById('message-modal-close');

    // Catalog and Cart Elements
    const productList = document.getElementById('product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const checkoutBtn = document.getElementById('checkout-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    // Note: sustratosBrandButtons, fertilizantesBrandButtons, subcategoryButtons are now handled dynamically
    
    // Subcategory/Brand Containers (hidden by default)
    const accessorySubcategoriesContainer = document.getElementById('accessory-subcategories');
    const sustratosBrandsContainer = document.getElementById('sustratos-brands');
    const fertilizantesBrandsContainer = document.getElementById('fertilizantes-brands');

    // Admin Elements
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminToggleBtn = document.getElementById('admin-toggle-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminToggleBtnMobile = document.getElementById('admin-toggle-btn-mobile');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');

    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminCancelBtn = document.getElementById('admin-cancel-btn');
    const adminLoginSubmitBtn = document.getElementById('admin-login-submit-btn');
    const productMgmtSection = document.getElementById('product-mgmt-section');
    
    // Product Management Form Elements
    const productFormName = document.getElementById('product-form-name');
    const productFormPrice = document.getElementById('product-form-price');
    const productFormImageUrl = document.getElementById('product-form-image-url');
    const productFormImageFile = document.getElementById('product-form-image-file');
    const productImagePreview = document.getElementById('product-image-preview');
    const previewPlaceholder = document.getElementById('preview-placeholder');
    const productFormCategory = document.getElementById('product-form-category');
    const productFormSubcategory = document.getElementById('product-form-subcategory'); 
    const productFormBrand = document.getElementById('product-form-brand'); 
    const productFormDescription = document.getElementById('product-form-description'); 
    const productFormSubmitBtn = document.getElementById('product-form-submit-btn');
    const formTitle = document.getElementById('form-title');
    const existingProductsList = document.getElementById('existing-products-list');

    // === State Variables ===
    const ADMIN_PASSWORD = 'losmarmotasadmin';
    const MAX_PARAGRAPHS_DISPLAY = 5; // Max paragraphs to show initially
    let isAdminLoggedIn = false;
    let editingProductId = null;
    let currentCategory = 'all'; // To maintain the active category state
    let currentBrand = 'all'; // To maintain the active brand state (for substrates/fertilizers)
    let currentSubcategory = 'all-accesorios'; // To maintain the active subcategory state (for accessories)


    // Product Data (with updated brand, subcategory info, and NEW longer descriptions)
    let products = JSON.parse(localStorage.getItem('growshopProducts')) || [
        // Substrates with brands
        { id: 1, name: 'Sustrato La Pacha Premium 50L', price: 3500, image: 'https://placehold.co/400x400/000000/32CD32?text=La+Pacha', category: 'sustratos', brand: 'la-pacha-sustrato', description: 'Sustrato orgánico de alta calidad para un crecimiento robusto. Ideal para todas las fases de tu cultivo.\n\nContiene una mezcla equilibrada de turba, perlita y humus de lombriz, proporcionando la aireación y retención de humedad perfectas.\n\nFomenta un desarrollo radicular explosivo, lo que se traduce en plantas más sanas y productivas.\n\nEs apto para cultivos de interior y exterior, y se adapta a una amplia variedad de especies vegetales.\n\n¡Un sustrato en el que puedes confiar para obtener los mejores resultados!' },
        { id: 16, name: 'Sustrato Tasty 50L', price: 3800, image: 'https://placehold.co/400x400/000000/32CD32?text=Tasty', category: 'sustratos', brand: 'tasty', description: 'Mezcla premium para un desarrollo óptimo de raíces.\n\nFormulado con los mejores componentes para garantizar una nutrición balanceada y constante.\n\nSu estructura ligera previene la compactación y asegura un drenaje excelente, evitando el exceso de humedad.\n\nEnriquece el suelo con microorganismos beneficiosos que mejoran la absorción de nutrientes.\n\nDiseñado para maximizar el potencial genético de tus plantas desde la germinación hasta la cosecha.' },
        { id: 17, name: 'Sustrato Cultivate Universal', price: 3200, image: 'https://placehold.co/400x400/000000/32CD32?text=Cultivate', category: 'sustratos', brand: 'cultivate', description: 'Versátil y enriquecido para todo tipo de plantas.\n\nEste sustrato es la base perfecta para cualquier tipo de cultivo, ofreciendo un soporte ideal.\n\nSu composición promueve una rápida germinación y un enraizamiento vigoroso, estableciendo bases sólidas.\n\nPosee una capacidad de aireación superior y una óptima gestión del agua, crucial para la salud de las raíces.\n\nUna opción confiable para cultivadores principiantes y experimentados que buscan eficiencia y simplicidad.' },

        // Fertilizers (new brands added)
        { id: 2, name: 'Fertilizante Top Crop Deeper Under', price: 2800, image: 'https://placehold.co/400x400/000000/32CD32?text=Top+Crop', category: 'fertilizantes', brand: 'top-crop', description: 'Estimulante radicular para un inicio fuerte.\n\nDeeper Underground de Top Crop es un poderoso enraizador que promueve un crecimiento explosivo del sistema radicular, lo que resulta en plantas más resistentes y saludables desde sus primeras etapas.\n\nSu formulación única a base de ácidos húmicos y fúlvicos, junto con extractos de algas, estimula la creación de nuevas raíces y fortalece las existentes, mejorando la absorción de nutrientes y la resistencia al estrés.\n\nEs ideal para usar durante las primeras semanas de vida de la planta, trasplantes y situaciones de estrés, asegurando una base sólida para un desarrollo posterior vigoroso y una floración abundante.\n\nCompatible con todo tipo de sustratos y sistemas de cultivo, es el secreto para maximizar el potencial de tus plantas desde abajo.' },
        { id: 19, name: 'Fertilizante Namaste Flora', price: 4200, image: 'https://placehold.co/400x400/000000/32CD32?text=Namaste', category: 'fertilizantes', brand: 'namaste', description: 'Potenciador de floración para cosechas abundantes.\n\nNamaste Flora es un fertilizante orgánico diseñado específicamente para potenciar la fase de floración de tus plantas. Su composición rica en fósforo y potasio es esencial para la formación de flores grandes y densas.\n\nAdemás de los macronutrientes clave, incorpora microelementos y extractos vegetales que promueven una floración explosiva y una mayor producción de resinas.\n\nEste producto es ideal para optimizar el rendimiento y la calidad de tus cosechas, aportando los elementos necesarios para que las flores se desarrollen al máximo de su potencial.\n\nSu origen orgánico asegura un cultivo limpio y respetuoso con el medio ambiente, sin dejar residuos no deseados en el producto final.' },
        { id: 20, name: 'Fertilizante Biobizz Grow', price: 4500, image: 'https://placehold.co/400x400/000000/32CD32?text=Biobizz', category: 'fertilizantes', brand: 'biobizz', description: 'Base orgánica para la fase de crecimiento.\n\nBiobizz Bio·Grow es un fertilizante líquido de crecimiento 100% orgánico, formulado a base de extracto de remolacha azucarera holandesa, conocido como vinaza. Este subproducto se obtiene mediante un proceso natural de fermentación y contiene azúcares que favorecen la vida microbiana del sustrato.\n\nSu alto contenido de nitrógeno, junto con otros nutrientes esenciales, promueve un crecimiento vegetativo exuberante, hojas verdes intensas y tallos fuertes.\n\nEs adecuado para ser utilizado en la mayoría de los tipos de suelos y sustratos, y se puede aplicar desde la aparición de las primeras hojas hasta el final de la producción de frutos.\n\nBio·Grow también ayuda a mejorar la estructura del suelo, aumentando la actividad microbiana y garantizando una base saludable para plantas vigorosas. Es la opción ideal para un crecimiento orgánico y sostenible.' },
        { id: 21, name: 'Fertilizante Revegetar Universal', price: 3000, image: 'https://placehold.co/400x400/000000/32CD32?text=Revegetar', category: 'fertilizantes', brand: 'revegetar', description: 'Fórmula completa para revitalizar tus plantas.\n\nRevegetar Universal es un fertilizante versátil diseñado para proporcionar una nutrición equilibrada durante todas las etapas de crecimiento de tus plantas. Su fórmula NPK (Nitrógeno, Fósforo, Potasio) está optimizada para promover tanto un desarrollo vegetativo fuerte como una floración abundante.\n\nEnriquecido con microelementos esenciales como el hierro, zinc y manganeso, este fertilizante previene deficiencias nutricionales y asegura la vitalidad de tus cultivos.\n\nEs fácil de usar y se disuelve completamente en agua, lo que facilita su aplicación tanto foliar como radicular.\n\nIdeal para aquellos que buscan una solución integral y eficaz para mantener sus plantas sanas y productivas en cualquier momento del ciclo.' },
        { id: 22, name: 'Fertilizante Mamboretá Fungi', price: 2500, image: 'https://placehold.co/400x400/000000/32CD32?text=Mamboreta', category: 'fertilizantes', brand: 'mamboreta', description: 'Fungicida preventivo para un cultivo sano.\n\nMamboretá Fungi es un fungicida sistémico y de contacto, especialmente formulado para proteger tus plantas de una amplia gama de enfermedades causadas por hongos.\n\nActúa de forma preventiva y curativa, controlando oídio, mildiu, roya y otras infecciones fúngicas que pueden comprometer la salud y el rendimiento de tus cultivos.\n\nSu aplicación es sencilla y eficaz, penetrando en el tejido vegetal para una protección interna y externa. Es seguro para la mayoría de las plantas ornamentales, frutales y hortícolas.\n\nEs fundamental seguir las indicaciones de dosificación y seguridad para asegurar una protección óptima sin dañar tus plantas ni el medio ambiente.\n\nUn aliado indispensable para mantener tus plantas libres de hongos y asegurar un desarrollo vigoroso.' },
        { id: 23, name: 'Fertilizante Vamp Bloom', price: 3800, image: 'https://placehold.co/400x400/000000/32CD32?text=Vamp', category: 'fertilizantes', brand: 'vamp', description: 'Acelerador de floración para resultados rápidos.\n\nVamp Bloom es un potente bioestimulante de floración diseñado para acelerar y magnificar la producción de flores y frutos en tus plantas. Su fórmula concentra aminoácidos, vitaminas y extractos de plantas marinas que actúan sinérgicamente.\n\nFavorece una floración temprana y explosiva, aumentando el número y el tamaño de los cogollos, así como la concentración de resinas y aceites esenciales.\n\nEs ideal para usar durante la transición de crecimiento a floración y a lo largo de toda la etapa de floración, complementando tu programa de nutrición habitual.\n\nCon Vamp Bloom, tus plantas alcanzarán su máximo potencial de producción, obteniendo cosechas más abundantes y de mayor calidad. ¡Prepárate para una explosión floral!' },
        { id: 24, name: 'Fertilizante Tasty Bud', price: 3300, image: 'https://placehold.co/400x400/000000/32CD32?text=Tasty+Fert', category: 'fertilizantes', brand: 'tasty', description: 'Potenciador de sabor y densidad para tus frutos.\n\nTasty Bud es un aditivo avanzado para la floración, diseñado para mejorar el perfil de sabor, aroma y la densidad de tus cosechas. Contiene una mezcla única de carbohidratos, azúcares y aminoácidos que nutren la planta y la vida microbiana del sustrato.\n\nEstos componentes estimulan la producción de terpenos y resinas, resultando en flores y frutos más aromáticos y con un sabor más pronunciado y auténtico.\n\nTambién contribuye al engorde de las flores, aumentando su peso y compactación, lo que se traduce en una mayor cantidad de producto final.\n\nEs perfecto para las últimas semanas de floración, asegurando que tus cosechas alcancen su máximo potencial en calidad y rendimiento. Ideal para aquellos que buscan la excelencia en sus cultivos.' },

        // Lighting
        { id: 3, name: 'Kit Iluminación LED', price: 15000, image: 'https://placehold.co/400x400/000000/32CD32?text=Kit+LED', category: 'iluminacion', description: 'Kit completo de iluminación LED de bajo consumo.\n\nEste sistema de iluminación LED de última generación es perfecto para optimizar el crecimiento de tus plantas en interiores.\n\nSu diseño de espectro completo proporciona la luz necesaria para todas las etapas del cultivo, desde la germinación hasta la floración, maximizando la fotosíntesis.\n\nAdemás, su tecnología de bajo consumo energético reduce significativamente tus facturas de electricidad en comparación con las luces tradicionales, mientras genera menos calor, lo que facilita el control de la temperatura en tu espacio de cultivo.\n\nDuradero y fácil de instalar, este kit es una inversión inteligente para cultivadores que buscan eficiencia, rendimiento y sostenibilidad.' },
        
        // Accessories (Parafernalia) with subcategories
        { id: 4, name: 'Filtros Celulosa y Blunt x100 Slim', price: 500, image: 'https://placehold.co/400x400/000000/32CD32?text=Filtros', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Filtros slim de celulosa para una fumada limpia.\n\nEstos filtros son ideales para quienes prefieren una experiencia de fumada más suave y pura. Su composición de celulosa natural ayuda a filtrar impurezas.\n\nVienen en un práctico paquete de 100 unidades, asegurando que siempre tengas suficientes a mano.\n\nDiseño slim, perfecto para enrollar con precisión y comodidad.\n\nUn accesorio esencial para disfrutar al máximo de tus momentos.' },
        { id: 5, name: 'Filtros Celulosa y Blunt Jumbo', price: 750, image: 'https://placehold.co/400x400/000000/32CD32?text=Filtros', category: 'parafernalia', subcategory: 'celulosa-y-blunt', description: 'Filtros jumbo para blunts, combustión lenta.\n\nDiseñados para una combustión lenta y uniforme, estos filtros son perfectos para blunts o preparaciones más grandes.\n\nEl tamaño jumbo asegura una mayor superficie de filtración y una fumada más fresca.\n\nFabricados con celulosa de alta calidad, son resistentes y no alteran el sabor.\n\nPack económico para los verdaderos conocedores.' },
        { id: 6, name: 'Papelillos OCB Premium x50', price: 300, image: 'https://placehold.co/400x400/000000/32CD32?text=Papelillos', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos ultra finos para una experiencia premium.\n\nLos OCB Premium son conocidos mundialmente por su delgadez y combustión lenta, ofreciendo una experiencia inigualable.\n\nCada paquete contiene 50 hojas de papel de arroz, garantizando una fumada suave y sin interferencias.\n\nAdhesivo natural de goma arábiga para un cierre perfecto.\n\nImprescindibles para cualquier aficionado.' },
        { id: 7, name: 'Papelillos Lion Rolling Circus', price: 450, image: 'https://placehold.co/400x400/000000/32CD32?text=Papelillos', category: 'parafernalia', subcategory: 'papelillos-y-filtros', description: 'Papelillos de cáñamo con diseños divertidos.\n\nSumérgete en el mundo de Lion Rolling Circus con estos papelillos únicos y coloridos.\n\nFabricados con cáñamo natural, ofrecen una combustión limpia y uniforme, respetando el sabor.\n\nCada librillo presenta ilustraciones originales de personajes del circo, añadiendo un toque de diversión a tus momentos.\n\nUna opción ecológica y estilosa para los que buscan algo diferente.' },
        { id: 8, name: 'Picador Metálico 3 Partes', price: 1200, image: 'https://placehold.co/400x400/000000/32CD32?text=Picador', category: 'parafernalia', subcategory: 'picadores', description: 'Picador resistente de metal con tres compartimentos.\n\nEste picador de metal está diseñado para durar y ofrecer un triturado perfecto en cada uso.\n\nSus tres partes permiten un molido eficiente y un compartimento inferior para el polen, optimizando el aprovechamiento.\n\nLos dientes afilados garantizan una consistencia uniforme, ideal para una combustión pareja.\n\nCompacto y discreto, es el compañero ideal para llevar a cualquier parte.' },
        { id: 9, name: 'Picador Plástico Simple', price: 600, image: 'https://placehold.co/400x400/000000/32CD32?text=Picador', category: 'parafernalia', subcategory: 'picadores', description: 'Picador básico y funcional de plástico.\n\nEl picador de plástico es una opción económica y práctica para el día a día.\n\nLigero y fácil de transportar, cumple su función de manera eficiente con sus dientes afilados.\n\nDisponible en varios colores vibrantes para adaptarse a tu estilo.\n\nIdeal para quienes buscan una herramienta sencilla y efectiva sin complicaciones.' },
        { id: 10, name: 'Bandeja Raw Mediana', price: 1800, image: 'https://placehold.co/400x400/000000/32CD32?text=Bandeja', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Bandeja metálica oficial de Raw, tamaño mediano.\n\nLa bandeja Raw Mediana es el accesorio definitivo para mantener tu espacio de preparación limpio y organizado.\n\nFabricada en metal resistente, cuenta con los icónicos logotipos de Raw y bordes elevados que evitan derrames.\n\nSu tamaño es ideal para acomodar todos tus accesorios de fumada sin ocupar demasiado espacio.\n\nPerfecta para coleccionistas y para uso diario, una pieza esencial para cualquier aficionado a Raw.' },
        { id: 11, name: 'Cenicero de Silicona', price: 950, image: 'https://placehold.co/400x400/000000/32CD32?text=Cenicero', category: 'parafernalia', subcategory: 'bandejas-ceniceros', description: 'Cenicero irrompible y fácil de limpiar.\n\nEste cenicero de silicona es la solución perfecta para evitar roturas accidentales y facilitar la limpieza.\n\nSu material flexible y resistente al calor lo hace ideal para uso en interiores y exteriores.\n\nDiseño moderno y disponible en varios colores, se adapta a cualquier ambiente.\n\nUn accesorio práctico y duradero para tu hogar o espacio de ocio.' },
        { id: 12, name: 'Frasco Hermético 100ml', price: 800, image: 'https://placehold.co/400x400/000000/32CD32?text=Frasco', category: 'parafernalia', subcategory: 'guardado', description: 'Frasco de cristal con cierre hermético para conservar.\n\nEste frasco de cristal de 100ml es ideal para preservar la frescura y las propiedades de tus hierbas y otros productos sensibles a la humedad.\n\nEl cierre hermético de alta calidad asegura que el contenido se mantenga protegido del aire y la luz, prolongando su vida útil.\n\nSu tamaño compacto lo hace perfecto para el almacenamiento discreto y fácil de transportar.\n\nUn indispensable para mantener la calidad de tus productos intacta.' },
        { id: 13, name: 'Bolsa Mylar Antiolor', price: 200, image: 'https://placehold.co/400x400/000000/32CD32?text=Bolsa', category: 'parafernalia', subcategory: 'guardado', description: 'Bolsa resellable con tecnología antiolor.\n\nLas bolsas Mylar antiolor son la solución más eficaz para el almacenamiento discreto y seguro de productos aromáticos.\n\nFabricadas con múltiples capas de Mylar, bloquean los olores y protegen el contenido de la humedad y la luz UV.\n\nCierre zip resellable que garantiza la hermeticidad y la frescura del interior.\n\nPerfectas para viajes o para mantener la discreción en casa.' },
        { id: 14, name: 'Encendedor Bic Grande', price: 400, image: 'https://placehold.co/400x400/000000/32CD32?text=Encendedor', category: 'parafernalia', subcategory: 'encendedores', description: 'Encendedor Bic clásico, duradero y confiable.\n\nEl encendedor Bic Grande es un ícono de confiabilidad y durabilidad, un clásico que nunca falla.\n\nSu diseño simple y robusto lo hace perfecto para el uso diario, ofreciendo miles de encendidos garantizados.\n\nSeguro y fácil de usar, con llama ajustable y resistente al viento, es el encendedor preferido por millones.\n\nUn producto esencial que combina eficiencia y economía en un solo diseño atemporal.' },
        { id: 15, name: 'Encendedor Recargable USB', price: 1500, image: 'https://placehold.co/400x400/000000/32CD32?text=Encendedor+USB', category: 'parafernalia', subcategory: 'encendedores', description: 'Encendedor eléctrico recargable vía USB, sin llama.\n\nOlvídate del gas y las llamas con este moderno encendedor recargable USB. Funciona con un arco eléctrico que enciende al instante, incluso en condiciones de viento.\n\nSe carga fácilmente a través de cualquier puerto USB, lo que lo convierte en una opción ecológica y económica a largo plazo.\n\nSu diseño elegante y compacto lo hace ideal para llevar en el bolsillo o en el bolso. Además, es un regalo perfecto.\n\nInnovación y practicidad unidas en este dispositivo de última generación.' },
        
        // Cultivation Accessories (with descriptions)
        { id: 18, name: 'Tijera de Poda Curva', price: 1100, image: 'https://placehold.co/400x400/000000/32CD32?text=Tijera', category: 'accesorios-de-cultivo', description: 'Tijera de precisión con punta curva para manicura.\n\nEsta tijera de poda con punta curva es la herramienta indispensable para una manicura precisa y delicada de tus plantas.\n\nSus hojas de acero inoxidable afiladas permiten realizar cortes limpios y exactos, minimizando el daño a la planta.\n\nEl diseño ergonómico y las empuñaduras antideslizantes aseguran un agarre cómodo y reducen la fatiga durante largas sesiones de poda.\n\nIdeal para trabajos finos en plantas delicadas, te ayudará a mantener la salud y la estética de tus cultivos con facilidad y eficiencia.' },
        { id: 25, name: 'Medidor de PH Digital', price: 2500, image: 'https://placehold.co/400x400/000000/32CD32?text=Medidor+PH', category: 'accesorios-de-cultivo', description: 'Medidor digital de PH para control del agua de riego.\n\nControlar el pH de tu solución de riego es crucial para la salud de tus plantas, y este medidor digital lo hace fácil y preciso.\n\nProporciona lecturas rápidas y fiables, asegurando que tus plantas absorban los nutrientes de manera óptima.\n\nCompacto y fácil de calibrar, es una herramienta esencial para cualquier cultivador, sea principiante o experimentado.\n\nUna pequeña inversión que marca una gran diferencia en la calidad y el rendimiento de tus cultivos.' },
        { id: 26, name: 'Malla Scrog 1x1m', price: 900, image: 'https://placehold.co/400x400/000000/32CD32?text=Malla+Scrog', category: 'accesorios-de-cultivo', description: 'Malla para método SCROG, optimiza la distribución de ramas.\n\nLa malla SCROG (Screen of Green) de 1x1 metro es una técnica avanzada para maximizar la producción en espacios limitados.\n\nPermite guiar el crecimiento horizontal de las ramas, creando un dosel uniforme y optimizando la exposición a la luz de todas las flores.\n\nFabricada con materiales resistentes y duraderos, es fácil de instalar y reutilizar en múltiples ciclos de cultivo.\n\nIdeal para quienes buscan un mayor rendimiento y una distribución equitativa de la energía en sus plantas.' },
        { id: 27, name: 'Extractor de Aire 4"', price: 8500, image: 'https://placehold.co/400x400/000000/32CD32?text=Extractor', category: 'accesorios-de-cultivo', description: 'Extractor de aire silencioso para renovación del ambiente.\n\nUn extractor de aire de 4 pulgadas es fundamental para mantener un ambiente de cultivo óptimo, controlando la temperatura y la humedad.\n\nSu funcionamiento silencioso asegura que no perturbará tu entorno, mientras que su potente motor garantiza una ventilación eficiente.\n\nElimina el aire viciado y el exceso de calor, previniendo problemas como moho y plagas, y promoviendo un flujo de aire constante para el desarrollo saludable de tus plantas.\n\nFácil de instalar, es una pieza clave para cualquier sistema de ventilación de cultivo interior.' },
        { id: 28, name: 'Termohigrómetro Digital', price: 1800, image: 'https://placehold.co/400x400/000000/32CD32?text=Termometro', category: 'accesorios-de-cultivo', description: 'Controla temperatura y humedad con este dispositivo digital.\n\nEl termohigrómetro digital es una herramienta esencial para monitorear y optimizar las condiciones ambientales en tu espacio de cultivo.\n\nProporciona lecturas precisas de temperatura y humedad, dos factores críticos que impactan directamente en el crecimiento y la salud de tus plantas.\n\nSu pantalla de fácil lectura y la capacidad de registrar máximos y mínimos te permiten mantener un control constante y realizar ajustes oportunos.\n\nCompacto y fiable, es el aliado perfecto para asegurar que tus plantas prosperen en el ambiente ideal.' },
    ];
    let cart = [];

    // Function to populate brand and subcategory options in the admin form
    function populateProductFormBrands() {
        const brands = [
            // Substrate Brands
            { value: 'tasty', text: 'Tasty (Sustratos)' },
            { value: 'cultivate', text: 'Cultivate' },
            { value: 'la-pacha-sustrato', text: 'La Pacha Sustrato' },
            // Fertilizer Brands (updated)
            { value: 'top-crop', text: 'Top Crop' },
            { value: 'namaste', text: 'Namaste' },
            { value: 'biobizz', text: 'Biobizz' },
            { value: 'revegetar', text: 'Revegetar' },
            { value: 'mamboreta', text: 'Mamboretá' },
            { value: 'vamp', text: 'Vamp' },
            { value: 'tasty-fert', text: 'Tasty (Fertilizantes)' },
        ];
        productFormBrand.innerHTML = '<option value="">Selecciona Marca</option>';
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.value;
            option.textContent = brand.text;
            productFormBrand.appendChild(option);
        });

        // Subcategory options for Parafernalia
        const subcategories = [
            { value: 'celulosa-y-blunt', text: 'Celulosa y Blunt' },
            { value: 'papelillos-y-filtros', text: 'Papelillos y Filtros' },
            { value: 'picadores', text: 'Picadores' },
            { value: 'bandejas-ceniceros', text: 'Bandejas y Ceniceros' },
            { value: 'guardado', text: 'Guardado' },
            { value: 'encendedores', text: 'Encendedores' },
        ];
        productFormSubcategory.innerHTML = '<option value="">Selecciona Subcategoría (Accesorios)</option>';
        subcategories.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.value;
            option.textContent = sub.text;
            productFormSubcategory.appendChild(option);
        });
    }

    // === Helper Functions ===

    // Saves products to localStorage
    function saveProductsToLocalStorage() {
        localStorage.setItem('growshopProducts', JSON.stringify(products));
    }

    // Displays a message in the custom modal
    function showMessage(message) {
        messageModalText.textContent = message;
        messageModal.classList.remove('hidden');
    }

    // Updates the admin UI (buttons, section visibility)
    function updateAdminUI() {
        if (isAdminLoggedIn) {
            adminLoginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            logoutBtnMobile.classList.remove('hidden');
            adminToggleBtn.textContent = 'Ocultar Gestión';
            adminToggleBtnMobile.textContent = 'Ocultar Gestión';
        } else {
            adminLoginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            logoutBtnMobile.classList.add('hidden');
            adminToggleBtn.textContent = 'Gestión Admin';
            adminToggleBtnMobile.textContent = 'Gestión Admin';
            productMgmtSection.classList.add('hidden');
        }
    }

    /**
     * Renders products in the catalog view applying filters.
     * @param {string} category - The category to filter ('all' for all).
     * @param {string} selectedBrand - The brand to filter (optional, for substrates/fertilizers).
     * @param {string} selectedSubcategory - The subcategory to filter (optional, for accessories).
     */
    function renderProducts(category, selectedBrand, selectedSubcategory) {
        productList.innerHTML = '';
        let filteredProducts = products;

        // Main filtering logic based on category
        if (category === 'parafernalia') {
            filteredProducts = products.filter(p => p.category === 'parafernalia');
            if (selectedSubcategory && selectedSubcategory !== 'all-accesorios') {
                filteredProducts = filteredProducts.filter(p => p.subcategory === selectedSubcategory);
            }
        } else if (category === 'accesorios-de-cultivo') {
            // When "Accesorios de Cultivo" is selected, filter by this category
            filteredProducts = products.filter(p => p.category === 'accesorios-de-cultivo');
            // No subfilters are applied for this category.
        } else if (category !== 'all') {
            filteredProducts = products.filter(p => p.category === category);
        }

        // Apply brand filter if the category is substrates or fertilizers and a brand is selected
        if ((category === 'sustratos' || category === 'fertilizantes') && selectedBrand && selectedBrand !== 'all-sustratos' && selectedBrand !== 'all-fertilizantes') {
            filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
        }

        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p class="col-span-full text-center text-gray-500">No hay productos en esta categoría o marca/subcategoría.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            let descriptionHtml = '';
            if (product.description) {
                const paragraphs = product.description.split('\n\n').filter(p => p.trim() !== ''); // Split by double newline for paragraphs
                const initialParagraphs = paragraphs.slice(0, MAX_PARAGRAPHS_DISPLAY);
                const remainingParagraphs = paragraphs.slice(MAX_PARAGRAPHS_DISPLAY);

                descriptionHtml += '<div class="product-description-container text-gray-700 text-sm mb-2">';
                initialParagraphs.forEach(p => {
                    descriptionHtml += `<p>${p}</p>`;
                });

                if (remainingParagraphs.length > 0) {
                    descriptionHtml += `<div class="hidden-paragraphs hidden">`;
                    remainingParagraphs.forEach(p => {
                        descriptionHtml += `<p>${p}</p>`;
                    });
                    descriptionHtml += `</div>`;
                    descriptionHtml += `<button class="toggle-description-btn text-green-600 hover:text-green-800 font-semibold mt-2 flex items-center justify-start">
                                            Ver más... <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </button>`;
                }
                descriptionHtml += '</div>';
            }

            const productCard = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover object-center" onerror="this.onerror=null;this.src='https://placehold.co/400x400/cccccc/333333?text=Imagen+No+Disp.''">
                    <div class="p-4">
                        <h4 class="text-lg font-bold">${product.name}</h4>
                        <p class="text-sm text-gray-500 capitalize mb-2">Categoría: ${product.category || 'Sin Categoría'}${product.subcategory ? ` / Subcategoría: ${product.subcategory.replace(/-/g, ' ')}` : ''}${product.brand ? ` / Marca: ${product.brand.replace(/-/g, ' ')}` : ''}</p>
                        ${descriptionHtml}
                        <p class="text-xl font-losmarmotas text-green-600 mb-4">$${product.price.toLocaleString('es-AR')}</p>
                        <button data-id="${product.id}" class="add-to-cart-btn w-full bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition">
                            Añadir al Carrito
                        </button>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });

        // Add event listeners for new toggle buttons after rendering products
        document.querySelectorAll('.toggle-description-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const container = e.target.closest('.product-description-container');
                const hiddenParagraphsDiv = container.querySelector('.hidden-paragraphs');
                const svgIcon = e.target.querySelector('svg');

                if (hiddenParagraphsDiv.classList.contains('hidden')) {
                    hiddenParagraphsDiv.classList.remove('hidden');
                    e.target.innerHTML = `Ver menos... <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>`;
                } else {
                    hiddenParagraphsDiv.classList.add('hidden');
                    e.target.innerHTML = `Ver más... <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>`;
                }
            });
        });
    }

    // Renders items in the cart
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.appendChild(emptyCartMsg);
            emptyCartMsg.classList.remove('hidden');
            checkoutBtn.disabled = true;
        } else {
            emptyCartMsg.classList.add('hidden');
            cart.forEach(item => {
                const cartItem = `
                    <div class="flex justify-between items-center text-sm">
                        <div>
                            <p class="font-bold">${item.name}</p>
                            <p class="text-gray-600">$${item.price.toLocaleString('es-AR')} x ${item.quantity}</p>
                        </div>
                        <button data-id="${item.id}" class="remove-from-cart-btn text-red-500 hover:text-red-700 font-bold">X</button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItem;
            });
            checkoutBtn.disabled = false;
        }
        updateCartTotal();
    }

    // Updates the cart total
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `$${total.toLocaleString('es-AR')}`;
    }

    // Adds a product to the cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (product) {
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            renderCart();
        }
    }
    
    // Removes a product from the cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    // Renders the list of existing products in the admin section
    function renderExistingProducts() {
        existingProductsList.innerHTML = '';
        products.forEach(product => {
            const productItem = `
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg">
                    <div class="mb-2 sm:mb-0 sm:mr-4 flex-grow">
                        <span class="font-semibold block sm:inline">${product.name}</span>
                        <span class="text-sm text-gray-600 block sm:inline sm:ml-2">($${product.price.toLocaleString('es-AR')})</span>
                        <span class="text-sm text-gray-500 block sm:inline sm:ml-2 capitalize">Categoría: ${product.category || 'Sin Categoría'}${product.subcategory ? ` / Subcategoría: ${product.subcategory.replace(/-/g, ' ')}` : ''}${product.brand ? ` / Marca: ${product.brand.replace(/-/g, ' ')}` : ''}</span>
                        ${product.description ? `<p class="text-gray-600 text-xs mt-1">Descripción: ${product.description.substring(0, 100)}...</p>` : ''} <!-- Display truncated description in admin list -->
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <button data-id="${product.id}" class="edit-product-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition">Editar</button>
                        <button data-id="${product.id}" class="delete-product-btn px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">Eliminar</button>
                    </div>
                </div>
            `;
            existingProductsList.innerHTML += productItem;
        });

        document.querySelectorAll('.delete-product-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                products = products.filter(p => p.id !== productId);
                saveProductsToLocalStorage();
                renderExistingProducts();
                renderProducts(currentCategory, currentBrand, currentSubcategory); // Re-render with current filters
                showMessage('Producto eliminado exitosamente.');
            });
        });

        document.querySelectorAll('.edit-product-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                editProduct(productId);
                productMgmtSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Resets the product management form
    function resetProductForm() {
        formTitle.textContent = 'Añadir Nuevo Producto';
        productFormSubmitBtn.textContent = 'Añadir Producto';
        productFormName.value = '';
        productFormPrice.value = '';
        productFormImageUrl.value = '';
        productFormImageFile.value = '';
        productImagePreview.classList.add('hidden');
        previewPlaceholder.classList.remove('hidden');
        productImagePreview.src = '';
        productFormCategory.value = '';
        productFormSubcategory.classList.add('hidden'); // Hide by default
        productFormBrand.classList.add('hidden'); // Hide by default
        productFormSubcategory.value = ''; // Reset value
        productFormBrand.value = ''; // Reset value
        productFormDescription.value = ''; 
        editingProductId = null;
    }

    // Loads product data for editing
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            formTitle.textContent = `Editar Producto: ${product.name}`;
            productFormSubmitBtn.textContent = 'Guardar Cambios';
            productFormName.value = product.name;
            productFormPrice.value = product.price;
            productFormImageUrl.value = product.image;
            productFormCategory.value = product.category;
            productFormDescription.value = product.description || ''; 
            
            // Show and load subcategory if it's 'parafernalia'
            if (product.category === 'parafernalia') {
                productFormSubcategory.classList.remove('hidden');
                productFormSubcategory.value = product.subcategory || '';
                productFormBrand.classList.add('hidden'); // Hide brand field
            } else if (product.category === 'sustratos' || product.category === 'fertilizantes') {
                productFormBrand.classList.remove('hidden'); // Show brand field
                productFormBrand.value = product.brand || '';
                productFormSubcategory.classList.add('hidden'); // Hide subcategory field
            } else { // If it's any other category, including 'accesorios-de-cultivo'
                productFormSubcategory.classList.add('hidden');
                productFormBrand.classList.add('hidden');
            }
            
            if (product.image) {
                productImagePreview.src = product.image;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
            } else {
                productImagePreview.classList.add('hidden');
                previewPlaceholder.classList.remove('hidden');
                productImagePreview.src = '';
            }
            productFormImageFile.value = '';
            editingProductId = productId;
        }
    }

    // Handles product form submission (add/edit)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;
        const subcategory = productFormSubcategory.value;
        const brand = productFormBrand.value;
        const description = productFormDescription.value.trim(); 

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa los campos Nombre, Precio y Categoría. Asegúrate de que el precio sea un número válido.');
            return;
        }

        // Additional validation for subcategory or brand based on the main category
        if (category === 'parafernalia' && !subcategory) {
            showMessage('Por favor, selecciona una Subcategoría para Parafernalia.');
            return;
        }
        if ((category === 'sustratos' || category === 'fertilizantes') && !brand) {
            showMessage('Por favor, selecciona una Marca para Sustratos o Fertilizantes.');
            return;
        }

        const newProductData = {
            name,
            price,
            image,
            category,
            description 
        };

        if (category === 'parafernalia') {
            newProductData.subcategory = subcategory;
        } else if (category === 'sustratos' || category === 'fertilizantes') {
            newProductData.brand = brand;
        }
        // No 'subcategory' or 'brand' assigned if the category is 'accesorios-de-cultivo'

        if (editingProductId) {
            // Edit existing product
            products = products.map(p =>
                p.id === editingProductId ? { ...p, ...newProductData } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...newProductData, id: newId });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(currentCategory, currentBrand, currentSubcategory); // Re-render with current filters
    });

    // Control visibility of subcategory/brand selects in the admin form
    productFormCategory.addEventListener('change', function() {
        productFormSubcategory.classList.add('hidden');
        productFormBrand.classList.add('hidden');
        productFormSubcategory.value = ''; 
        productFormBrand.value = ''; 

        if (this.value === 'parafernalia') {
            productFormSubcategory.classList.remove('hidden');
        } else if (this.value === 'sustratos' || this.value === 'fertilizantes') {
            productFormBrand.classList.remove('hidden');
        }
        // If the selected category is 'accesorios-de-cultivo', subcategory and brand fields remain hidden.
    });


    // === Catalog Event Listeners ===

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Message modal close
    messageModalClose.addEventListener('click', () => {
        messageModal.classList.add('hidden');
    });

    // Add to cart from product list
    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Remove from cart
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Checkout via WhatsApp
    checkoutBtn.addEventListener('click', () => {
        const phoneNumber = '541123956472';
        let message = '¡Hola Los Marmotas Grow Shop! Estoy interesado en los siguientes productos:\n\n';
        
        cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity})\n`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal estimado: $${total.toLocaleString('es-AR')}`;

        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Event listener for main category filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryToFilter = button.getAttribute('data-category');
            const isBrandButton = button.classList.contains('brand-btn');
            const isSubcategoryButton = button.classList.contains('subcategory-btn');

            // Deactivate all main filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-green-500', 'text-black');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });
            
            // Hide all subcategory/brand containers at the start of each click
            accessorySubcategoriesContainer.classList.add('hidden');
            sustratosBrandsContainer.classList.add('hidden');
            fertilizantesBrandsContainer.classList.add('hidden');

            if (isBrandButton) {
                // Logic for brand buttons (Substrates/Fertilizers)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                if (button.closest('#sustratos-brands')) {
                    currentCategory = 'sustratos';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    sustratosBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="sustratos"]').classList.add('bg-green-500', 'text-black');
                } else if (button.closest('#fertilizantes-brands')) {
                    currentCategory = 'fertilizantes';
                    currentBrand = button.getAttribute('data-brand');
                    currentSubcategory = 'all-accesorios'; 
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.remove('bg-gray-200', 'text-gray-800');
                    document.querySelector('.filter-btn[data-category="fertilizantes"]').classList.add('bg-green-500', 'text-black');
                }
                
            } else if (isSubcategoryButton) {
                // Logic for subcategory buttons (within Parafernalia)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');

                currentCategory = 'parafernalia'; 
                currentSubcategory = button.getAttribute('data-subcategory');
                currentBrand = 'all'; 
                accessorySubcategoriesContainer.classList.remove('hidden'); 

                // Activate the main category button "Parafernalia"
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.remove('bg-gray-200', 'text-gray-800');
                document.querySelector('.filter-btn[data-category="parafernalia"]').classList.add('bg-green-500', 'text-black');
                
                // Ensure the "Accesorios de Cultivo" button is not active
                const accesoriosCultivoBtn = document.querySelector('.filter-btn[data-category="accesorios-de-cultivo"]');
                if (accesoriosCultivoBtn) {
                    accesoriosCultivoBtn.classList.remove('bg-green-500', 'text-black');
                    accesoriosCultivoBtn.classList.add('bg-gray-200', 'text-gray-800');
                }

            } else { // Logic for main category buttons (All, Substrates, Fertilizers, Lighting, Parafernalia, Cultivation Accessories)
                button.classList.remove('bg-gray-200', 'text-gray-800');
                button.classList.add('bg-green-500', 'text-black');
                currentCategory = categoryToFilter;
                currentBrand = 'all'; 
                currentSubcategory = 'all-accesorios'; 

                // Show relevant subcategory/brand container if applicable
                if (currentCategory === 'parafernalia') {
                    accessorySubcategoriesContainer.classList.remove('hidden');
                    // Activate the "All Accessories" button by default
                    document.querySelector('#accessory-subcategories .subcategory-btn[data-subcategory="all-accesorios"]').click();
                } else if (currentCategory === 'accesorios-de-cultivo') {
                    // If "Accesorios de Cultivo" is selected, hide subfilters
                    accessorySubcategoriesContainer.classList.add('hidden');
                    // No need to call .click() on all-accesorios here, as subfilters are not shown.
                    // The renderProducts logic will display products for this category.
                } else if (currentCategory === 'sustratos') {
                    sustratosBrandsContainer.classList.remove('hidden');
                    // Activate "All Substrates Brands" button by default
                    document.querySelector('#sustratos-brands .brand-btn[data-brand="all-sustratos"]').click();
                } else if (currentCategory === 'fertilizantes') {
                    fertilizantesBrandsContainer.classList.remove('hidden');
                    // Activate "All Fertilizers Brands" button by default
                    document.querySelector('#fertilizantes-brands .brand-btn[data-brand="all-fertilizantes"]').click();
                }
            }
            renderProducts(currentCategory, currentBrand, currentSubcategory);
        });
    });

    // === Admin Event Listeners ===
    adminLoginBtn.addEventListener('click', () => {
        adminLoginModal.classList.remove('hidden');
        adminPasswordInput.value = '';
    });

    adminCancelBtn.addEventListener('click', () => {
        adminLoginModal.classList.add('hidden');
    });

    adminLoginSubmitBtn.addEventListener('click', () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            adminLoginModal.classList.add('hidden');
            isAdminLoggedIn = true;
            updateAdminUI();
            productMgmtSection.classList.remove('hidden');
            resetProductForm();
            renderExistingProducts();
            showMessage('Has iniciado sesión como administrador.');
            productMgmtSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage('Contraseña incorrecta.');
        }
    });

    // Event for logout button (desktop)
    logoutBtn.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        showMessage('Has cerrado sesión de administrador.');
    });

    // Event for logout button (mobile)
    logoutBtnMobile.addEventListener('click', () => {
        isAdminLoggedIn = false;
        updateAdminUI();
        mobileMenu.classList.add('hidden');
        showMessage('Has cerrado sesión de administrador.');
    });

    // Toggle product management section (desktop)
    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => {
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtn.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Toggle product management section (mobile)
    if (adminToggleBtnMobile) {
        adminToggleBtnMobile.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (isAdminLoggedIn) {
                productMgmtSection.classList.toggle('hidden');
                adminToggleBtnMobile.textContent = productMgmtSection.classList.contains('hidden') ? 'Gestión Admin' : 'Ocultar Gestión';
                if (!productMgmtSection.classList.contains('hidden')) {
                    productMgmtSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                adminLoginModal.classList.remove('hidden');
            }
        });
    }

    // Handle image preview when entering URL
    productFormImageUrl.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
            productImagePreview.src = url;
            productImagePreview.classList.remove('hidden');
            previewPlaceholder.classList.add('hidden');
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Handle image preview when selecting local file
    productFormImageFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productImagePreview.src = e.target.result;
                productImagePreview.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
                productFormImageUrl.value = e.target.result;
                showMessage('Imagen local cargada para previsualización. Para almacenamiento permanente, esta imagen debe ser una URL pública.');
            };
            reader.readAsDataURL(file);
        } else {
            productImagePreview.classList.add('hidden');
            previewPlaceholder.classList.remove('hidden');
            productImagePreview.src = '';
        }
    });

    // Handles product form submission (add/edit)
    productFormSubmitBtn.addEventListener('click', () => {
        const name = productFormName.value.trim();
        const price = parseFloat(productFormPrice.value);
        const image = productFormImageUrl.value.trim();
        const category = productFormCategory.value;
        const subcategory = productFormSubcategory.value;
        const brand = productFormBrand.value;
        const description = productFormDescription.value.trim(); 

        if (!name || isNaN(price) || price <= 0 || !category) {
            showMessage('Por favor, completa los campos Nombre, Precio y Categoría. Asegúrate de que el precio sea un número válido.');
            return;
        }

        // Additional validation for subcategory or brand based on the main category
        if (category === 'parafernalia' && !subcategory) {
            showMessage('Por favor, selecciona una Subcategoría para Parafernalia.');
            return;
        }
        if ((category === 'sustratos' || category === 'fertilizantes') && !brand) {
            showMessage('Por favor, selecciona una Marca para Sustratos o Fertilizantes.');
            return;
        }

        const newProductData = {
            name,
            price,
            image,
            category,
            description 
        };

        if (category === 'parafernalia') {
            newProductData.subcategory = subcategory;
        } else if (category === 'sustratos' || category === 'fertilizantes') {
            newProductData.brand = brand;
        }
        // No 'subcategory' or 'brand' assigned if the category is 'accesorios-de-cultivo'

        if (editingProductId) {
            // Edit existing product
            products = products.map(p =>
                p.id === editingProductId ? { ...p, ...newProductData } : p
            );
            showMessage('Producto actualizado exitosamente.');
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...newProductData, id: newId });
            showMessage('Producto añadido exitosamente.');
        }

        saveProductsToLocalStorage();
        resetProductForm();
        renderExistingProducts();
        renderProducts(currentCategory, currentBrand, currentSubcategory); // Re-render with current filters
    });

    // Control visibility of subcategory/brand selects in the admin form
    productFormCategory.addEventListener('change', function() {
        productFormSubcategory.classList.add('hidden');
        productFormBrand.classList.add('hidden');
        productFormSubcategory.value = ''; 
        productFormBrand.value = ''; 

        if (this.value === 'parafernalia') {
            productFormSubcategory.classList.remove('hidden');
        } else if (this.value === 'sustratos' || this.value === 'fertilizantes') {
            productFormBrand.classList.remove('hidden');
        }
        // If the selected category is 'accesorios-de-cultivo', subcategory and brand fields remain hidden.
    });


    // === Initialization on page load ===
    updateAdminUI();
    populateProductFormBrands();
    renderProducts(currentCategory, currentBrand, currentSubcategory); // Display products initially
    document.getElementById('filter-all').click(); // Activate "All" button on start
    renderCart();
});
