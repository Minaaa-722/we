const mysql = require('mysql2/promise');

const products = [
    {
        "id": 1,
        "name": "梦幻独角兽盲盒",
        "description": "超萌独角兽系列盲盒，每一款都有独特的颜色和配件，材质安全环保，适合收藏和赠送。隐藏款概率1/100哦！",
        "price": 59.00,
        "originalPrice": 79.00,
        "isHot": 1,
        "isNew": 1,
        "images": [
            "https://picsum.photos/seed/unicorn1/800/800",
            "https://picsum.photos/seed/unicorn2/800/800",
            "https://picsum.photos/seed/unicorn3/800/800",
            "https://picsum.photos/seed/unicorn4/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/unicorndetail1/1200/1200",
            "https://picsum.photos/seed/unicorndetail2/1200/1200",
            "https://picsum.photos/seed/unicorndetail3/1200/1200"
        ],
        "styles": [
            {"name": "彩虹独角兽", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/unicorn1/800/800"},
            {"name": "星空独角兽", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/unicorn2/800/800"},
            {"name": "樱花独角兽", "type": "normal", "probability": 39, "image": "https://picsum.photos/seed/unicorn3/800/800"},
            {"name": "海洋独角兽", "type": "rare", "probability": 1, "image": "https://picsum.photos/seed/unicorn4/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 0
    },
    {
        "id": 2,
        "name": "治愈系猫咪盲盒",
        "description": "可爱猫咪造型盲盒，每只猫咪都有独特的表情和姿势，萌化你的心。材质光滑无毛刺，适合所有年龄段收藏。",
        "price": 49.00,
        "originalPrice": 69.00,
        "isHot": 1,
        "isNew": 0,
        "images": [
            "https://picsum.photos/seed/cat1/800/800",
            "https://picsum.photos/seed/cat2/800/800",
            "https://picsum.photos/seed/cat3/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/catdetail1/1200/1200",
            "https://picsum.photos/seed/catdetail2/1200/1200"
        ],
        "styles": [
            {"name": "困倦猫", "type": "normal", "probability": 40, "image": "https://picsum.photos/seed/cat1/800/800"},
            {"name": "好奇猫", "type": "normal", "probability": 45, "image": "https://picsum.photos/seed/cat2/800/800"},
            {"name": "傲娇猫", "type": "rare", "probability": 15, "image": "https://picsum.photos/seed/cat3/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-08-05 19:16:21",
        "remaining": 88
    },
    {
        "id": 3,
        "name": "太空探险盲盒",
        "description": "宇宙主题盲盒套装，包含宇航员、星球和航天器造型，细节精致，采用环保ABS材质，隐藏款为神秘黑洞造型。",
        "price": 69.00,
        "originalPrice": 99.00,
        "isHot": 1,
        "isNew": 1,
        "images": [
            "https://picsum.photos/seed/space1/800/800",
            "https://picsum.photos/seed/space2/800/800",
            "https://picsum.photos/seed/space3/800/800",
            "https://picsum.photos/seed/space4/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/spacedetail1/1200/1200",
            "https://picsum.photos/seed/spacedetail2/1200/1200",
            "https://picsum.photos/seed/spacedetail3/1200/1200"
        ],
        "styles": [
            {"name": "月球宇航员", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/space1/800/800"},
            {"name": "火星探测器", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/space2/800/800"},
            {"name": "土星环", "type": "normal", "probability": 35, "image": "https://picsum.photos/seed/space3/800/800"},
            {"name": "银河战舰", "type": "rare", "probability": 5, "image": "https://picsum.photos/seed/space4/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-08-05 21:59:01",
        "remaining": 52
    },
    {
        "id": 4,
        "name": "古风汉服娃娃盲盒",
        "description": "传统服饰盲盒系列，包含唐、宋、明等朝代服饰造型，做工精细，服饰可脱卸，隐藏款为凤冠霞帔造型。",
        "price": 79.00,
        "originalPrice": 109.00,
        "isHot": 0,
        "isNew": 1,
        "images": [
            "https://picsum.photos/seed/hanfu1/800/800",
            "https://picsum.photos/seed/hanfu2/800/800",
            "https://picsum.photos/seed/hanfu3/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/hanfudetail1/1200/1200",
            "https://picsum.photos/seed/hanfudetail2/1200/1200",
            "https://picsum.photos/seed/hanfudetail3/1200/1200"
        ],
        "styles": [
            {"name": "唐制齐胸", "type": "normal", "probability": 35, "image": "https://picsum.photos/seed/hanfu1/800/800"},
            {"name": "宋制褙子", "type": "normal", "probability": 35, "image": "https://picsum.photos/seed/hanfu2/800/800"},
            {"name": "明制马面", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/hanfu3/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 37
    },
    {
        "id": 5,
        "name": "甜品小铺盲盒",
        "description": "美食主题盲盒，包含各种甜点造型玩偶，自带香味，材质安全无毒，适合作为桌面装饰。",
        "price": 45.00,
        "originalPrice": 65.00,
        "isHot": 1,
        "isNew": 0,
        "images": [
            "https://picsum.photos/seed/sweet1/800/800",
            "https://picsum.photos/seed/sweet2/800/800",
            "https://picsum.photos/seed/sweet3/800/800",
            "https://picsum.photos/seed/sweet4/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/sweetdetail1/1200/1200",
            "https://picsum.photos/seed/sweetdetail2/1200/1200"
        ],
        "styles": [
            {"name": "草莓蛋糕", "type": "normal", "probability": 25, "image": "https://picsum.photos/seed/sweet1/800/800"},
            {"name": "抹茶冰淇淋", "type": "normal", "probability": 25, "image": "https://picsum.photos/seed/sweet2/800/800"},
            {"name": "巧克力挞", "type": "normal", "probability": 45, "image": "https://picsum.photos/seed/sweet3/800/800"},
            {"name": "马卡龙套装", "type": "rare", "probability": 5, "image": "https://picsum.photos/seed/sweet4/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 93
    },
    {
        "id": 6,
        "name": "赛博朋克机械盲盒",
        "description": "未来科技风格机械人盲盒，关节可动，部分部件带有夜光效果，隐藏款为终极机械战警。",
        "price": 89.00,
        "originalPrice": 129.00,
        "isHot": 0,
        "isNew": 1,
        "images": [
            "https://picsum.photos/seed/cyber1/800/800",
            "https://picsum.photos/seed/cyber2/800/800",
            "https://picsum.photos/seed/cyber3/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/cyberdetail1/1200/1200",
            "https://picsum.photos/seed/cyberdetail2/1200/1200",
            "https://picsum.photos/seed/cyberdetail3/1200/1200"
        ],
        "styles": [
            {"name": "机械步兵", "type": "normal", "probability": 40, "image": "https://picsum.photos/seed/cyber1/800/800"},
            {"name": "电子黑客", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/cyber2/800/800"},
            {"name": "生化改造人", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/cyber3/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 28
    },
    {
        "id": 7,
        "name": "森林精灵盲盒",
        "description": "童话风格森林精灵系列，每款都有专属魔法道具，采用植绒材质，手感细腻，隐藏款为森林女王。",
        "price": 59.00,
        "originalPrice": 79.00,
        "isHot": 1,
        "isNew": 0,
        "images": [
            "https://picsum.photos/seed/elf1/800/800",
            "https://picsum.photos/seed/elf2/800/800",
            "https://picsum.photos/seed/elf3/800/800",
            "https://picsum.photos/seed/elf4/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/elfdetail1/1200/1200",
            "https://picsum.photos/seed/elfdetail2/1200/1200"
        ],
        "styles": [
            {"name": "树精灵", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/elf1/800/800"},
            {"name": "花仙子", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/elf2/800/800"},
            {"name": "风之精灵", "type": "normal", "probability": 35, "image": "https://picsum.photos/seed/elf3/800/800"},
            {"name": "月光精灵", "type": "rare", "probability": 5, "image": "https://picsum.photos/seed/elf4/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 65
    },
    {
        "id": 8,
        "name": "交通工具盲盒",
        "description": "迷你交通工具模型盲盒，包含汽车、飞机、船舶等，合金材质，可滑动，隐藏款为限量版超跑。",
        "price": 39.00,
        "originalPrice": 59.00,
        "isHot": 0,
        "isNew": 0,
        "images": [
            "https://picsum.photos/seed/vehicle1/800/800",
            "https://picsum.photos/seed/vehicle2/800/800",
            "https://picsum.photos/seed/vehicle3/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/vehicledetail1/1200/1200",
            "https://picsum.photos/seed/vehicledetail2/1200/1200",
            "https://picsum.photos/seed/vehicledetail3/1200/1200"
        ],
        "styles": [
            {"name": "城市公交车", "type": "normal", "probability": 40, "image": "https://picsum.photos/seed/vehicle1/800/800"},
            {"name": "货运卡车", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/vehicle2/800/800"},
            {"name": "直升机", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/vehicle3/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 112
    },
    {
        "id": 9,
        "name": "妖怪图鉴盲盒",
        "description": "传统神话妖怪系列盲盒，参考《山海经》设计，每款附带解说卡片，隐藏款为九尾狐。",
        "price": 65.00,
        "originalPrice": 89.00,
        "isHot": 1,
        "isNew": 1,
        "images": [
            "https://picsum.photos/seed/monster1/800/800",
            "https://picsum.photos/seed/monster2/800/800",
            "https://picsum.photos/seed/monster3/800/800",
            "https://picsum.photos/seed/monster4/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/monsterdetail1/1200/1200",
            "https://picsum.photos/seed/monsterdetail2/1200/1200"
        ],
        "styles": [
            {"name": "麒麟", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/monster1/800/800"},
            {"name": "凤凰", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/monster2/800/800"},
            {"name": "玄武", "type": "normal", "probability": 35, "image": "https://picsum.photos/seed/monster3/800/800"},
            {"name": "饕餮", "type": "rare", "probability": 5, "image": "https://picsum.photos/seed/monster4/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 41
    },
    {
        "id": 10,
        "name": "像素游戏角色盲盒",
        "description": "复古游戏风格像素角色盲盒，包含经典游戏角色，带有像素发光效果，隐藏款为最终BOSS。",
        "price": 55.00,
        "originalPrice": 75.00,
        "isHot": 0,
        "isNew": 1,
        "images": [
            "https://picsum.photos/seed/pixel1/800/800",
            "https://picsum.photos/seed/pixel2/800/800",
            "https://picsum.photos/seed/pixel3/800/800"
        ],
        "detailImages": [
            "https://picsum.photos/seed/pixeldetail1/1200/1200",
            "https://picsum.photos/seed/pixeldetail2/1200/1200",
            "https://picsum.photos/seed/pixeldetail3/1200/1200"
        ],
        "styles": [
            {"name": "像素骑士", "type": "normal", "probability": 35, "image": "https://picsum.photos/seed/pixel1/800/800"},
            {"name": "魔法巫师", "type": "normal", "probability": 35, "image": "https://picsum.photos/seed/pixel2/800/800"},
            {"name": "机械工程师", "type": "normal", "probability": 30, "image": "https://picsum.photos/seed/pixel3/800/800"}
        ],
        "createdAt": "2025-07-31 22:46:38",
        "updatedAt": "2025-07-31 22:46:38",
        "remaining": 76
    }
];

// 数据库连接配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'CMLcml123+',
  database: 'blindbox'
};

// 插入数据的函数
async function insertProducts() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功，开始插入数据...');

    // 清空表（谨慎操作，会删除原有数据，可根据实际需求决定是否保留）
    await connection.execute('TRUNCATE TABLE products');
    console.log('已清空原有 products 表数据');

    // 定义插入语句
    const insertQuery = `
      INSERT INTO products 
        (id, name, description, price, originalPrice, remaining, isHot, isNew, images, detailImages, styles) 
      VALUES 
        (?,?,?,?,?,?,?,?,?,?,?)
    `;

    // 循环插入每个产品数据
    for (const product of products) {
      const images = JSON.stringify(product.images);
      const detailImages = JSON.stringify(product.detailImages);
      const styles = JSON.stringify(product.styles);

      // 将布尔值转换为数据库可存储的格式（0或1）
      const isHotValue = product.isHot? 1 : 0;
      const isNewValue = product.isNew? 1 : 0;

      await connection.execute(
        insertQuery,
        [
          product.id,
          product.name,
          product.description,
          product.price,
          product.originalPrice,
          product.remaining,
          isHotValue,
          isNewValue,
          images,
          detailImages,
          styles
        ]
      );
      console.log(`插入产品 ${product.name} 成功`);
    }

    console.log('所有产品数据插入完成！');
    await connection.end();
  } catch (err) {
    console.error('数据插入过程出现错误:', err);
  }
}

// 执行插入数据的函数
insertProducts();