#!/bin/bash
echo "====== Frontend auto pulling ======"
cd /home/master/myapp/frontend
git fetch --all
git reset --hard origin/master
echo "✅ Frontend code pulled. Hãy restart bằng tay: npm run dev"
