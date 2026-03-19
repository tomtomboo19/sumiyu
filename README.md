# 墨湯 SUMIYU ♨️

全国のタトゥーOKな温泉・サウナ・銭湯・スパを検索できるポータルサイト

## セットアップ

```bash
npm install
npm run dev
```

## GitHub Pages へのデプロイ

### 手順

1. GitHub にリポジトリ `sumiyu` を作成

2. ローカルで以下を実行：
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/sumiyu.git
git push -u origin main
```

3. GitHub リポジトリの **Settings → Pages** を開く

4. **Source** を「**GitHub Actions**」に変更

5. push すると自動的にビルド＆デプロイされます

6. 公開URL：`https://<あなたのユーザー名>.github.io/sumiyu/`

> ⚠️ リポジトリ名を `sumiyu` 以外にする場合は `vite.config.js` の `base` もそのリポジトリ名に合わせてください。

## 技術スタック

- React 19
- Vite 6
- GitHub Actions (CI/CD)
