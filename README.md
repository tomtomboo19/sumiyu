# 墨湯 SUMIYU ♨️

全国のタトゥーOKな温泉・サウナ・銭湯・スパを検索できるポータルサイト

## ローカル開発

```bash
npm install
npm run dev
```

## GitHub Pages へのデプロイ手順

1. GitHub に新しいリポジトリを作成（名前は何でもOK）

2. ローカルで以下を実行：
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
git push -u origin main
```

3. GitHub リポジトリの **Settings → Pages → Source** を **「GitHub Actions」** に変更

4. push 時に自動でビルド＆デプロイされます

5. 公開URL: `https://<ユーザー名>.github.io/<リポジトリ名>/`

## 技術スタック

- React 19 + Vite 6
- GitHub Actions (自動デプロイ)
