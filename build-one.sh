#!/bin/sh
mkdir -p builds

theme="$1"
if [ -z "$theme" ]; then
    echo "Please specify a theme."
    exit 1
fi

[ -h src/theme ] && unlink src/theme
ln -s ../themes/$theme src/theme
echo "============================"
echo "Building $theme..."
echo "============================"
npm run build
rm -rf builds/$theme
mv dist builds/$theme
