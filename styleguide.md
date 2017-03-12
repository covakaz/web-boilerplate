<style>.fn-overview p { margin-bottom: 1em; } .fn-overview h1 { font-size: 32px;margin: .5em 0 1em; } .fn-overview h2{font-size: 24px; margin: 2em 0 1em;}</style>

# 概要

## スタイルガイドとは
サイト内で使用されるスタイル(css)をまとめたカタログのようなものです。  
ここでスタイルを確認することで、新しくスタイルを追加する際に車輪の再発明を防ぐことができます。

## 運用方法
このスタイルガイドは、gulpパッケージ「gulp-frontnote」を使用して出力しています。  
スタイルガイドに出力するには、実際のscssの各セレクタの上に、**決められた記述方法**でコメントを書くことで運用されます。

## 記述方法

下記の例は、「.uti-tal」「.uti-tac」「.uti-tar」のscssの記述3行の上に、スタイルガイドを出力するための**決められた記述方法**を書いたものです。

    /*
    #overview
    ユーティリティ
    */

    /*
    #styleguide
    文字揃え

    内側のインラインレベル要素をそれぞれ、左寄せ、中央寄せ、右寄せに揃える

    ```
    <p class="uti-tal">Lorem ipsum</p>
    <p class="uti-tac">Lorem ipsum</p>
    <p class="uti-tar">Lorem ipsum</p>
    ```
    */
    .uti-tal{ text-align: left   !important; }
    .uti-tac{ text-align: center !important; }
    .uti-tar{ text-align: right  !important; }

「#overview」は、scssファイル１つに1回記述します。  
スタイルガイドのサイドメニューは、scssファイル１つにつき表示されますが、「#overview」の真下の行のテキストはここで表示されるタイトルを決めるものでもあります。

「#styleguide」は、スタイルガイドに出力したいものをコードサンプルやコメントを書いて表示できるようにするものです。  
「#styleguide」と書かれた真下の行にそのスタイルの名前を書くことができ、一行開けてコメントを書くことができます。  
「```」でコードサンプルを囲うことで、スタイルガイド上に分かりやすくプレビューを表示することができます。
