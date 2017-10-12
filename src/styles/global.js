import { injectGlobal } from 'styled-components';

injectGlobal`
    *,::after,::before {
        box-sizing: border-box
    }

    * {
        margin: 0;
        padding: 0
    }

    html {
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    a { 
        text-decoration: none;
        -webkit-transition: all .2s;
        transition: all .2s;
    }

    img {
        max-width: 100%
    }

    ol,ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .clearfix:after,.clearfix:before {
        content: "";
        display: table
    }

    .clearfix:after {
        clear: both
    }

    .clearfix {
        zoom: 1
    }

    .fl {
        float: left!important
    }

    .fr {
        float: right!important
    }

    .hide {
        display: none
    }

    .show {
        display: block
    }

    .text-hide {
        background: 0 0;
        border: 0;
        color: transparent;
        font: 0/0 a;
        text-shadow: none
    }

    .text-l {
        text-align: left
    }

    .text-r {
        text-align: right
    }

    .text-c {
        text-align: center
    }

    .text-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    .text-clip {
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap
    }

    .text-break {
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
        word-break: break-word;
        word-wrap: break-word
    }

    .hand{
        cursor: pointer;
    }

    #app{
        height: 100%;
    }
`;
