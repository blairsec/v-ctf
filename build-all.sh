#!/bin/sh
mkdir -p builds
for theme in themes/*
do
    filename="${theme#themes/}"
    [ -h src/theme ] && unlink src/theme
    ln -s ../$theme src/theme
    echo "============================"
    echo "Building $filename..."
    echo "============================"
    npm run build
    mv dist builds/$filename
done
