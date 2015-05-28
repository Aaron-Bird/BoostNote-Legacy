angular.module('codexen.config')
  .constant('aceModes', [{
  "name": "ABAP",
  "mode": [
   "abap"
  ]
 },
 {
  "name": "ABC",
  "mode": [
   "abc"
  ]
 },
 {
  "name": "ActionScript",
  "mode": [
   "as"
  ]
 },
 {
  "name": "ADA",
  "mode": [
   "ada|adb"
  ]
 },
 {
  "name": "Apache_Conf",
  "mode": [
   "^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd"
  ]
 },
 {
  "name": "AsciiDoc",
  "mode": [
   "asciidoc|adoc"
  ]
 },
 {
  "name": "Assembly_x86",
  "mode": [
   "asm"
  ]
 },
 {
  "name": "AutoHotKey",
  "mode": [
   "ahk"
  ]
 },
 {
  "name": "BatchFile",
  "mode": [
   "bat|cmd"
  ]
 },
 {
  "name": "C9Search",
  "mode": [
   "c9search_results"
  ]
 },
 {
  "name": "C_Cpp",
  "mode": [
   "cpp|c|cc|cxx|h|hh|hpp"
  ]
 },
 {
  "name": "Cirru",
  "mode": [
   "cirru|cr"
  ]
 },
 {
  "name": "Clojure",
  "mode": [
   "clj|cljs"
  ]
 },
 {
  "name": "Cobol",
  "mode": [
   "CBL|COB"
  ]
 },
 {
  "name": "coffee",
  "mode": [
   "coffee|cf|cson|^Cakefile"
  ]
 },
 {
  "name": "ColdFusion",
  "mode": [
   "cfm"
  ]
 },
 {
  "name": "CSharp",
  "mode": [
   "cs"
  ]
 },
 {
  "name": "CSS",
  "mode": [
   "css"
  ]
 },
 {
  "name": "Curly",
  "mode": [
   "curly"
  ]
 },
 {
  "name": "D",
  "mode": [
   "d|di"
  ]
 },
 {
  "name": "Dart",
  "mode": [
   "dart"
  ]
 },
 {
  "name": "Diff",
  "mode": [
   "diff|patch"
  ]
 },
 {
  "name": "Dockerfile",
  "mode": [
   "^Dockerfile"
  ]
 },
 {
  "name": "Dot",
  "mode": [
   "dot"
  ]
 },
 {
  "name": "Dummy",
  "mode": [
   "dummy"
  ]
 },
 {
  "name": "DummySyntax",
  "mode": [
   "dummy"
  ]
 },
 {
  "name": "Eiffel",
  "mode": [
   "e"
  ]
 },
 {
  "name": "EJS",
  "mode": [
   "ejs"
  ]
 },
 {
  "name": "Elixir",
  "mode": [
   "ex|exs"
  ]
 },
 {
  "name": "Elm",
  "mode": [
   "elm"
  ]
 },
 {
  "name": "Erlang",
  "mode": [
   "erl|hrl"
  ]
 },
 {
  "name": "Forth",
  "mode": [
   "frt|fs|ldr"
  ]
 },
 {
  "name": "FTL",
  "mode": [
   "ftl"
  ]
 },
 {
  "name": "Gcode",
  "mode": [
   "gcode"
  ]
 },
 {
  "name": "Gherkin",
  "mode": [
   "feature"
  ]
 },
 {
  "name": "Gitignore",
  "mode": [
   "^.gitignore"
  ]
 },
 {
  "name": "Glsl",
  "mode": [
   "glsl|frag|vert"
  ]
 },
 {
  "name": "golang",
  "mode": [
   "go"
  ]
 },
 {
  "name": "Groovy",
  "mode": [
   "groovy"
  ]
 },
 {
  "name": "HAML",
  "mode": [
   "haml"
  ]
 },
 {
  "name": "Handlebars",
  "mode": [
   "hbs|handlebars|tpl|mustache"
  ]
 },
 {
  "name": "Haskell",
  "mode": [
   "hs"
  ]
 },
 {
  "name": "haXe",
  "mode": [
   "hx"
  ]
 },
 {
  "name": "HTML",
  "mode": [
   "html|htm|xhtml"
  ]
 },
 {
  "name": "HTML_Ruby",
  "mode": [
   "erb|rhtml|html.erb"
  ]
 },
 {
  "name": "INI",
  "mode": [
   "ini|conf|cfg|prefs"
  ]
 },
 {
  "name": "Io",
  "mode": [
   "io"
  ]
 },
 {
  "name": "Jack",
  "mode": [
   "jack"
  ]
 },
 {
  "name": "Jade",
  "mode": [
   "jade"
  ]
 },
 {
  "name": "Java",
  "mode": [
   "java"
  ]
 },
 {
  "name": "JavaScript",
  "mode": [
   "js|jsm"
  ]
 },
 {
  "name": "JSON",
  "mode": [
   "json"
  ]
 },
 {
  "name": "JSONiq",
  "mode": [
   "jq"
  ]
 },
 {
  "name": "JSP",
  "mode": [
   "jsp"
  ]
 },
 {
  "name": "JSX",
  "mode": [
   "jsx"
  ]
 },
 {
  "name": "Julia",
  "mode": [
   "jl"
  ]
 },
 {
  "name": "LaTeX",
  "mode": [
   "tex|latex|ltx|bib"
  ]
 },
 {
  "name": "Lean",
  "mode": [
   "lean|hlean"
  ]
 },
 {
  "name": "LESS",
  "mode": [
   "less"
  ]
 },
 {
  "name": "Liquid",
  "mode": [
   "liquid"
  ]
 },
 {
  "name": "Lisp",
  "mode": [
   "lisp"
  ]
 },
 {
  "name": "LiveScript",
  "mode": [
   "ls"
  ]
 },
 {
  "name": "LogiQL",
  "mode": [
   "logic|lql"
  ]
 },
 {
  "name": "LSL",
  "mode": [
   "lsl"
  ]
 },
 {
  "name": "Lua",
  "mode": [
   "lua"
  ]
 },
 {
  "name": "LuaPage",
  "mode": [
   "lp"
  ]
 },
 {
  "name": "Lucene",
  "mode": [
   "lucene"
  ]
 },
 {
  "name": "Makefile",
  "mode": [
   "^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"
  ]
 },
 {
  "name": "Markdown",
  "mode": [
   "md|markdown"
  ]
 },
 {
  "name": "Mask",
  "mode": [
   "mask"
  ]
 },
 {
  "name": "MATLAB",
  "mode": [
   "matlab"
  ]
 },
 {
  "name": "MEL",
  "mode": [
   "mel"
  ]
 },
 {
  "name": "MUSHCode",
  "mode": [
   "mc|mush"
  ]
 },
 {
  "name": "MySQL",
  "mode": [
   "mysql"
  ]
 },
 {
  "name": "Nix",
  "mode": [
   "nix"
  ]
 },
 {
  "name": "ObjectiveC",
  "mode": [
   "m|mm"
  ]
 },
 {
  "name": "OCaml",
  "mode": [
   "ml|mli"
  ]
 },
 {
  "name": "Pascal",
  "mode": [
   "pas|p"
  ]
 },
 {
  "name": "Perl",
  "mode": [
   "pl|pm"
  ]
 },
 {
  "name": "pgSQL",
  "mode": [
   "pgsql"
  ]
 },
 {
  "name": "PHP",
  "mode": [
   "php|phtml"
  ]
 },
 {
  "name": "Powershell",
  "mode": [
   "ps1"
  ]
 },
 {
  "name": "Praat",
  "mode": [
   "praat|praatscript|psc|proc"
  ]
 },
 {
  "name": "Prolog",
  "mode": [
   "plg|prolog"
  ]
 },
 {
  "name": "Properties",
  "mode": [
   "properties"
  ]
 },
 {
  "name": "Protobuf",
  "mode": [
   "proto"
  ]
 },
 {
  "name": "Python",
  "mode": [
   "py"
  ]
 },
 {
  "name": "R",
  "mode": [
   "r"
  ]
 },
 {
  "name": "RDoc",
  "mode": [
   "Rd"
  ]
 },
 {
  "name": "RHTML",
  "mode": [
   "Rhtml"
  ]
 },
 {
  "name": "Ruby",
  "mode": [
   "rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"
  ]
 },
 {
  "name": "Rust",
  "mode": [
   "rs"
  ]
 },
 {
  "name": "SASS",
  "mode": [
   "sass"
  ]
 },
 {
  "name": "SCAD",
  "mode": [
   "scad"
  ]
 },
 {
  "name": "Scala",
  "mode": [
   "scala"
  ]
 },
 {
  "name": "Scheme",
  "mode": [
   "scm|rkt"
  ]
 },
 {
  "name": "SCSS",
  "mode": [
   "scss"
  ]
 },
 {
  "name": "SH",
  "mode": [
   "sh|bash|^.bashrc"
  ]
 },
 {
  "name": "SJS",
  "mode": [
   "sjs"
  ]
 },
 {
  "name": "Smarty",
  "mode": [
   "smarty|tpl"
  ]
 },
 {
  "name": "snippets",
  "mode": [
   "snippets"
  ]
 },
 {
  "name": "Soy_Template",
  "mode": [
   "soy"
  ]
 },
 {
  "name": "Space",
  "mode": [
   "space"
  ]
 },
 {
  "name": "SQL",
  "mode": [
   "sql"
  ]
 },
 {
  "name": "SQLServer",
  "mode": [
   "sqlserver"
  ]
 },
 {
  "name": "Stylus",
  "mode": [
   "styl|stylus"
  ]
 },
 {
  "name": "SVG",
  "mode": [
   "svg"
  ]
 },
 {
  "name": "Tcl",
  "mode": [
   "tcl"
  ]
 },
 {
  "name": "Tex",
  "mode": [
   "tex"
  ]
 },
 {
  "name": "Text",
  "mode": [
   "txt"
  ]
 },
 {
  "name": "Textile",
  "mode": [
   "textile"
  ]
 },
 {
  "name": "Toml",
  "mode": [
   "toml"
  ]
 },
 {
  "name": "Twig",
  "mode": [
   "twig"
  ]
 },
 {
  "name": "Typescript",
  "mode": [
   "ts|typescript|str"
  ]
 },
 {
  "name": "Vala",
  "mode": [
   "vala"
  ]
 },
 {
  "name": "VBScript",
  "mode": [
   "vbs|vb"
  ]
 },
 {
  "name": "Velocity",
  "mode": [
   "vm"
  ]
 },
 {
  "name": "Verilog",
  "mode": [
   "v|vh|sv|svh"
  ]
 },
 {
  "name": "VHDL",
  "mode": [
   "vhd|vhdl"
  ]
 },
 {
  "name": "XML",
  "mode": [
   "xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"
  ]
 },
 {
  "name": "XQuery",
  "mode": [
   "xq"
  ]
 },
 {
  "name": "YAML",
  "mode": [
   "yaml|yml"
  ]
 },
 {
  "name": "Django",
  "mode": [
   "html"
  ]
 }
])
