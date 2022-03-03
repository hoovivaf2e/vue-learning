#!/usr/bin/env sh

# 當發生錯誤時中止腳本
set -e

npm run build

# cd 到構建輸出的目錄下
cd dist

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:hoovivaf2e/vue-learning/week6.git master:gh-pages

cd -