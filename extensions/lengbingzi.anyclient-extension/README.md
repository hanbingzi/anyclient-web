# any-client-extension

## 目录说明

```md
.
├── src                             # 源码目录
│    ├── extend
│    │   ├── browser                # browser 层
│    │   │   ├── component-a.tsx
│    │   │   ├── component-b.tsx
│    │   │   └── index.ts
│    │   └── node                   # node 层
│    │       └── index.ts
│    ├── extension.ts
│    └── test
│        ├── extension.test.ts
│        └── index.ts
├── out/                            # 编译输出目录
├── CHANGELOG.md
├── README.md
├── package.json
├── tsconfig.json
├── tslint.json
├── typings
├── webpack.config.entry.js        # 入口工程配置
├── webpack.config.browser.js      # browser 工程配置
└── webpack.config.node.js         # node 工程配置
```

## 运行
```bash
# 开发
$ npm run watch

# 编译
$ npm run compile
```
