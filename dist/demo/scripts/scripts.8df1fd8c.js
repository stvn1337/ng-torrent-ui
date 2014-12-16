"use strict";angular.module("utorrentNgwebuiApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap","vs-repeat","toastr"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"TorrentsCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/settings",{templateUrl:"views/settings.html",controller:"SettingsCtrl"}).otherwise({redirectTo:"/"})}]).controller("NavController",function(){}),angular.module("utorrentNgwebuiApp").controller("TorrentsCtrl",["$scope","$window","$modal","$filter","$timeout","$log","uTorrentService","Torrent","toastr",function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=[];for(b=0;b<a.length;b++)a[b].selected&&c.push(a[b]);return c}function k(b){var c=[];return b?c.push(b.hash):angular.forEach(a.selectedtorrents,function(a){c.push(a.hash)}),c}a.headerHeight=350,a.setListHeight=function(){a.listHeight=b.innerHeight-200},angular.element(b).bind("resize",function(){a.setListHeight(),a.$apply()}),a.setListHeight(),a.labels=[],a.torrents=[],a.filteredtorrents=[],a.selectedtorrents=[];var l,m=g.cacheMap;a.autoreloadTimeout=-1,a.newtorrent="",a.addTorrent=function(){var b=a.newtorrent,c=g.torrent().add({data:b});c.$promise.then(function(){i.info("Torrent added succesfully",null,{timeOut:1e3}),a.newtorrent=""})},a.doAction=function(b,c){var d=k(c);if("info"===b)return void a.showDetails(c);var e=g.actions()[b];if(e){var f=e({hash:d});return f.$promise.then(function(){}),f}i.warning("Action "+b+" not yet supported",null,{timeOut:1e3})},a.filterspanel={open:!0,filters:{name:"",label:"",l33t:!0,selected:!1,status:""}},a.filters=a.filterspanel.filters,a.sorter={field:"torrentQueueOrder",secondField:"name",ascending:!0},a.doSort=function(){f.info("sorting");var b=function(a,b){return a===b?0:a>b?1:-1},c=function(c,d){var e,f,g,h=c,i=d;return h===i?0:(a.sorter.ascending&&(e=i,i=h,h=e),"function"==typeof h[a.sorter.field]?(f=h[a.sorter.field](),g=i[a.sorter.field]()):(f=h[a.sorter.field],g=i[a.sorter.field]),f===g?0:b(f,g))};a.filteredtorrents=a.filteredtorrents.sort(c)},a.sortBy=function(b){a.sorter.field===b?a.sorter.ascending=!a.sorter.ascending:a.sorter.field=b,a.doSort()};var n;a.notL33table=!1,a.doFilter=function(c){a.notL33table=-1===a.filters.name.search(/^[a-z0-9 ]+$/i),e.cancel(n);var g=function(){f.info("filtering");var c,e,g,h={};if(null===a.filters.label?delete h.label:h.label=a.filters.label,null===a.filters.status?delete h.status:h.status=a.filters.status,h.selected=a.filters.selected,null===a.filters.name||""===a.filters.name)delete h.name;else{var i=a.filters.name.split(" ").join(".");if(h.name=i,!a.notL33table&&a.filters.l33t===!0){var j="";for(c=0;c<i.length;c++)e=i.charAt(c),g=b.L33t.Translate(e),j+=e===g?e:"["+e+g+"]";h.name=j}}a.filteredtorrents=d("filter")(a.torrents,function(a){var b=!0;if(h.label&&(b=a.label===h.label),h.selected&&(b=a.selected===!0),h.status)switch(h.status){case"completed":b=a.isStatusCompleted();break;case"downloading":b=a.isStatusDownloading();break;case"paused":b=a.isStatusPaused();break;case"queued":b=a.isStatusQueued();break;case"seeding":b=a.isStatusSeeding()}if(b&&h.name&&""!==h.name){var c=a.name;b=c.search(new RegExp(h.name,"i"))>-1}return b}),a.doSort()};c===!0?n=e(g,500):g()},a.filterBy=function(){a.doFilter()};var o=function(a){return a.replace(/[\._]/g," ").replace(/(\[[^\]]*\])(.*)$/,"$2 $1").trim()};a.reload=function(b){if(!a.refreshing){a.refreshing=!0,e.cancel(l),f.info("reload torrents");var c=g.torrents().list();c.$promise.then(function(){var d,i,k=!1;if(a.labels=c.label,null===m&&(m={}),c.torrents&&c.torrents.length>0){k=!0,f.debug('"torrents" key with '+c.torrents.length+" elements");var n={};for(d=0;d<c.torrents.length;d++)i=h.build(c.torrents[d],null,o(c.torrents[d][2])),m[i.hash]&&(i.selected=m[i.hash].selected),n[i.hash]=i;m=n}if(c.torrentp&&c.torrentp.length>0)for(k=!0,f.debug('"torrentp" key with '+c.torrentp.length+" elements"),d=0;d<c.torrentp.length;d++)i=h.build(c.torrentp[d],null,o(c.torrentp[d][2])),m[i.hash]&&(i.selected=m[i.hash].selected),m[i.hash]=i;if(c.torrentm&&c.torrentm.length>0)for(k=!0,f.debug('"torrentm" key with '+c.torrentm.length+" elements"),d=0;d<c.torrentm.length;d++)delete m[c.torrentm[d]];k?(a.torrents=[],angular.forEach(m,function(b){a.torrents.push(b)}),a.doFilter(),g.cacheMap=m,a.selectedtorrents=j(a.torrents)):f.debug("no changes"),b!==!0&&a.autoreloadTimeout>-1&&(l=e(a.reload,a.autoreloadTimeout)),a.torrentsMap=m,p(a.lastTorrentDetails),a.refreshing=!1})}};var p=function(b){b&&(a.doAction("getprops",b).$promise.then(function(a){b.props=a.props[0]}),a.doAction("getfiles",b).$promise.then(function(a){b.files=a.files[1]}))};a.showDetails=function(b){a.lastTorrentDetails=b,p(b);var d=c.open({templateUrl:"views/details-dialog.html",controller:"DetailsDialogCtrl",backdrop:!0,size:"lg",resolve:{torrent:function(){return a.lastTorrentDetails}}});d.result.then(function(){},function(){a.lastTorrentDetails=null})},a.updateSelected=function(){a.selectedtorrents=j(a.torrents)},a.lastSelectedHash=null,a.setSelected=function(b,c){var d,e=c.ctrlKey||c.metaKey,f=c.shiftKey,g=0;if(f){var h=-1,i=-1;for(d=0;d<a.filteredtorrents.length&&(-1===h&&a.filteredtorrents[d].hash===b&&(h=d),-1===i&&a.filteredtorrents[d].hash===a.lastSelectedHash&&(i=d),-1===h||-1===i);d++);if(h===i)return;for(-1===i&&(i=0),h>i?(g=h+1,d=i):(g=i+1,d=h);g>d;d++)a.filteredtorrents[d].selected=!0}else if(e)for(d=0;d<a.torrents.length;d++)a.torrents[d].hash===b&&(a.torrents[d].selected=!a.torrents[d].selected);else for(d=0;d<a.torrents.length;d++){var j=a.torrents[d].hash===b;a.torrents[d].selected=j}a.lastSelectedHash=b,a.updateSelected()},a.selectCheckbox=!1,a.$watch("selectCheckbox",function(b){var c;for(c=0;c<a.filteredtorrents.length;c++)a.filteredtorrents[c].selected=b;a.updateSelected()}),a.$on("$destroy",function(){}),g.getToken(function(){a.reload()},function(){f.error("error",arguments)}),a.$on("$routeChangeStart",function(){e.cancel(l)})}]),angular.module("utorrentNgwebuiApp").controller("AboutCtrl",["$scope","uTorrentService",function(a,b){a.url=b.url}]),angular.module("utorrentNgwebuiApp").controller("SettingsCtrl",["$scope","uTorrentService",function(a,b){a.signIn=function(){b.conf.url=a.url,b.conf.user=a.user,b.conf.password=a.password,b.getToken()}}]),angular.module("utorrentNgwebuiApp").factory("Torrent",["$window","$log",function(a,b){function c(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u){this.selected=!1,this.hash=a,this.status=b,this.name=c,this.size=d,this.percent=e,this.downloaded=f,this.uploaded=g,this.ratio=h,this.uploadSpeed=i,this.downloadSpeed=j,this.eta=k,this.label=l,this.peersConnected=m,this.peersInSwarm=n,this.seedsConnected=o,this.seedsInSwarm=p,this.availability=q,this.torrentQueueOrder=r,this.remaining=s,this.additionalData=t,this.decodedName=u?u:this.name,this.getStatuses()}function d(a){var b,c;return 1024>a?(b=a,c="B"):1048576>a?(b=(a/1024).toFixed(1),c="KB"):1073741824>a?(b=(a/1048576).toFixed(1),c="MB"):(b=(a/1073741824).toFixed(1),c="GB"),[b,c]}var e={1:"started",2:"checking",4:"startaftercheck",8:"checked",16:"error",32:"paused",64:"queued",128:"loaded"},f=[1,2,4,8,16,32,64,128].reverse();return c.prototype.getStatusFlag=function(a){return(this.status&a)===a},c.prototype.getStatuses=function(){var a=0;if(this.statusesCached)return this.statusesCached;var c=[];for(a=0;a<f.length;a++)this.getStatusFlag(f[a])&&c.push(e[f[a]]);return this.status>255&&(c.push("unknown"),b.warn("unknown status: "+this.status)),1e3===this.percent&&c.push("completed"),this.statusesCached=c,this.statusesCached},c.prototype.isStatusStarted=function(){return this.getStatusFlag(1)},c.prototype.isStatusChecking=function(){return this.getStatusFlag(2)},c.prototype.isStatusStartAfterCheck=function(){return this.getStatusFlag(4)},c.prototype.isStatusChecked=function(){return this.getStatusFlag(8)},c.prototype.isStatusError=function(){return this.getStatusFlag(16)},c.prototype.isStatusPaused=function(){return this.getStatusFlag(32)},c.prototype.isStatusQueued=function(){return this.getStatusFlag(64)&&!this.isStatusDownloading()},c.prototype.isStatusLoaded=function(){return this.getStatusFlag(128)},c.prototype.isStatusCompleted=function(){return 1e3===this.percent},c.prototype.isStatusDownloading=function(){return this.isStatusStarted()&&!this.isStatusCompleted()},c.prototype.isStatusSeeding=function(){return this.isStatusStarted()&&this.isStatusCompleted()},c.prototype.getQueueStr=function(){return-1===this.torrentQueueOrder?"*":this.torrentQueueOrder},c.prototype.getPercentStr=function(){return(this.percent/10).toFixed(0)+"%"},c.prototype.getData=function(){return this.additionalData},c.prototype.formatBytes=function(a){return d(a).join("")},c.prototype.getDownloadedStrArr=function(){return this.downloadedStrArr||(this.downloadedStrArr=d(this.downloaded)),this.downloadedStrArr},c.prototype.getUploadedStrArr=function(){return this.uploadedStrArr||(this.uploadedStrArr=d(this.uploaded)),this.uploadedStrArr},c.prototype.getSizeStrArr=function(){return this.sizeStrArr||(this.sizeStrArr=d(this.size)),this.sizeStrArr},c.prototype.getUpSpeedStrArr=function(){if(!this.upSpeedStrArr){var a=d(this.uploadSpeed);a[1]=a[1]+"/s",this.upSpeedStrArr=a}return this.upSpeedStrArr},c.prototype.getDownSpeedStrArr=function(){if(!this.downSpeedStrArr){var a=d(this.downloadSpeed);a[1]=a[1]+"/s",this.downSpeedStrArr=a}return this.downSpeedStrArr},c.prototype.getLabels=function(){return"string"==typeof this.label?[this.label]:this.label},c.prototype.getMainLabel=function(){var a=this.getLabels();return a&&a.length>0?a[0]:""},c.build=function(a,b,d){return new c(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15],a[16],a[17],a[18],b,d)},c}]).factory("uTorrentService",["$http","$resource","$log",function(a,b,c){var d={url:"/gui/",password:null,token:null,cid:0},e={response:function(a){d.cid=a.data.torrentc},responseError:function(a){console.log("error in interceptor",d,arguments,a)}};return{cacheMap:{},conf:d,getToken:function(b){c.info("get token"),a.get(d.url+"token.html?t="+Date.now()).success(function(a){var e=a.match(/>([^<]+)</);e&&(d.token=e[e.length-1],c.info("got token "+d.token)),b&&b()})},torrent:function(){return b(d.url+".?token=:token&:action:opt:data&t=:t",{token:d.token,t:Date.now()},{add:{method:"GET",params:{action:"action=add-url",opt:"&s="},isArray:!1}})},torrents:function(){return b(d.url+".?:action:data&token=:token&cid=:cid:opt&t=:t",{token:d.token,cid:d.cid,t:Date.now()},{list:{method:"GET",params:{action:"list=1"},interceptor:e,isArray:!1}})},actions:function(){return b(d.url+".?action=:action&token=:token&t=:t",{token:d.token,cid:d.cid,t:Date.now()},{start:{params:{action:"start"}},stop:{params:{action:"stop"}},pause:{params:{action:"pause"}},remove:{params:{action:"remove"}},forcestart:{params:{action:"forcestart"}},recheck:{params:{action:"recheck"}},queueup:{params:{action:"queueup"}},queuedown:{params:{action:"queuedown"}},getprops:{params:{action:"getprops"}},getfiles:{params:{action:"getfiles"}}})}}}]),function(a){var b={};b.Translate=function(a,b){if(b||(b=45),b=b>=100?100:0>=b?0:b,0===b)return a;var c="",d=0;for(d=0;d<a.length;d++){var e=a.charAt(d);if(17>b&&b>0)switch(e){case"e":c+="3";break;case"E":c+="3";break;default:c+=e}else if(33>b&&b>16)switch(e){case"a":c+="4";break;case"e":c+="3";break;case"i":c+="1";break;case"o":c+="0";break;case"A":c+="4";break;case"E":c+="3";break;case"I":c+="1";break;case"O":c+="0";break;default:c+=e}else if(49>b&&b>32)switch(e){case"a":c+="4";break;case"e":c+="3";break;case"i":c+="1";break;case"o":c+="0";break;case"A":c+="4";break;case"E":c+="3";break;case"I":c+="1";break;case"O":c+="0";break;case"s":c+="5";break;case"S":c+="5";break;case"t":c+="7";break;case"T":c+="7";break;case"z":c+="2";break;case"Z":c+="2";break;default:c+=e}else if(65>b&&b>48)switch(e){case"a":c+="4";break;case"e":c+="3";break;case"i":c+="1";break;case"o":c+="0";break;case"A":c+="4";break;case"E":c+="3";break;case"I":c+="1";break;case"O":c+="0";break;case"k":c+="|{";break;case"K":c+="|{";break;case"s":c+="5";break;case"S":c+="5";break;case"g":c+="9";break;case"G":c+="9";break;case"l":c+="£";break;case"L":c+="£";break;case"c":c+="(";break;case"C":c+="(";break;case"t":c+="7";break;case"T":c+="7";break;case"z":c+="2";break;case"Z":c+="2";break;case"y":c+="¥";break;case"Y":c+="¥";break;case"u":c+="µ";break;case"U":c+="µ";break;case"f":c+="ƒ";break;case"F":c+="ƒ";break;case"d":c+="Ð";break;case"D":c+="Ð";break;default:c+=e}else if(81>b&&b>64)switch(e){case"a":c+="4";break;case"e":c+="3";break;case"i":c+="1";break;case"o":c+="0";break;case"A":c+="4";break;case"E":c+="3";break;case"I":c+="1";break;case"O":c+="0";break;case"k":c+="|{";break;case"K":c+="|{";break;case"s":c+="5";break;case"S":c+="5";break;case"g":c+="9";break;case"G":c+="9";break;case"l":c+="£";break;case"L":c+="£";break;case"c":c+="(";break;case"C":c+="(";break;case"t":c+="7";break;case"T":c+="7";break;case"z":c+="2";break;case"Z":c+="2";break;case"y":c+="¥";break;case"Y":c+="¥";break;case"u":c+="µ";break;case"U":c+="µ";break;case"f":c+="ƒ";break;case"F":c+="ƒ";break;case"d":c+="Ð";break;case"D":c+="Ð";break;case"n":c+="|\\|";break;case"N":c+="|\\|";break;case"w":c+="\\/\\/";break;case"W":c+="\\/\\/";break;case"h":c+="|-|";break;case"H":c+="|-|";break;case"v":c+="\\/";break;case"V":c+="\\/";break;case"m":c+="|\\/|";break;case"M":c+="|\\/|";break;default:c+=e}else if(b>80&&100>b)switch(e){case"a":c+="4";break;case"e":c+="3";break;case"i":c+="1";break;case"o":c+="0";break;case"A":c+="4";break;case"E":c+="3";break;case"I":c+="1";break;case"O":c+="0";break;case"s":c+="5";break;case"S":c+="5";break;case"g":c+="9";break;case"G":c+="9";break;case"l":c+="£";break;case"L":c+="£";break;case"c":c+="(";break;case"C":c+="(";break;case"t":c+="7";break;case"T":c+="7";break;case"z":c+="2";break;case"Z":c+="2";break;case"y":c+="¥";break;case"Y":c+="¥";break;case"u":c+="µ";break;case"U":c+="µ";break;case"f":c+="ƒ";break;case"F":c+="ƒ";break;case"d":c+="Ð";break;case"D":c+="Ð";break;case"n":c+="|\\|";break;case"N":c+="|\\|";break;case"w":c+="\\/\\/";break;case"W":c+="\\/\\/";break;case"h":c+="|-|";break;case"H":c+="|-|";break;case"v":c+="\\/";break;case"V":c+="\\/";break;case"k":c+="|{";break;case"K":c+="|{";break;case"r":c+="®";break;case"R":c+="®";break;case"m":c+="|\\/|";break;case"M":c+="|\\/|";break;case"b":c+="ß";break;case"B":c+="ß";break;case"q":c+="Q";break;case"Q":c+="Q¸";break;case"x":c+=")(";break;case"X":c+=")(";break;default:c+=e}else if(b>99)switch(e){case"a":c+="4";break;case"e":c+="3";break;case"i":c+="1";break;case"o":c+="0";break;case"A":c+="4";break;case"E":c+="3";break;case"I":c+="1";break;case"O":c+="0";break;case"s":c+="5";break;case"S":c+="5";break;case"g":c+="9";break;case"G":c+="9";break;case"l":c+="£";break;case"L":c+="£";break;case"c":c+="(";break;case"C":c+="(";break;case"t":c+="7";break;case"T":c+="7";break;case"z":c+="2";break;case"Z":c+="2";break;case"y":c+="¥";break;case"Y":c+="¥";break;case"u":c+="µ";break;case"U":c+="µ";break;case"f":c+="ƒ";break;case"F":c+="ƒ";break;case"d":c+="Ð";break;case"D":c+="Ð";break;case"n":c+="|\\|";break;case"N":c+="|\\|";break;case"w":c+="\\/\\/";break;case"W":c+="\\/\\/";break;case"h":c+="|-|";break;case"H":c+="|-|";break;case"v":c+="\\/";break;case"V":c+="\\/";break;case"k":c+="|{";break;case"K":c+="|{";break;case"r":c+="®";break;case"R":c+="®";break;case"m":c+="|\\/|";break;case"M":c+="|\\/|";break;case"b":c+="ß";break;case"B":c+="ß";break;case"j":c+="_|";break;case"J":c+="_|";break;case"P":c+="|°";break;case"q":c+="¶";break;case"Q":c+="¶¸";break;case"x":c+=")(";break;case"X":c+=")(";break;default:c+=e}}return c},a.L33t=b}(window),angular.module("utorrentNgwebuiApp").directive("torrentRow",function(){return{priority:1e3,templateUrl:"views/torrent-row.html",restrict:"E",replace:!0,link:function(a){var b=a.item;if(b){var c,d,e,f,g,h;b.getStatuses(),b.isStatusError()&&!b.isStatusCompleted()?(c="exclamation-sign",d="Error",e="text-danger"):b.isStatusLoaded()?b.isStatusChecked()?b.isStatusSeeding()?(c="collapse-up",d="Seeding",e="text-success"):b.isStatusDownloading()?(c="collapse-down",d="Downloading",e="text-info",f="warning",g="pause",h="pause"):b.isStatusChecking()?(c="repeat",d="Checking",e="text-info"):b.isStatusStartAfterCheck()?(c="repeat",d="Start after checking",e="text-info"):b.isStatusPaused()?(c="pause",d="Paused",e="text-info"):b.isStatusQueued()?(c="time",d="Queued",e="text-info"):b.isStatusLoaded()&&b.isStatusChecked()?b.isStatusCompleted()?(c="check",d="Completed",e="text-success",f="",g="stop",h="stop"):(c="unchecked",d="Ready",e="",f="success",g="play-circle",h="start"):(c="question-sign",d="Status not supported: "+parseInt(b.status).toString(2)):(c="warning-sign",d="Torrent needs checking",e="text-warning"):(c="warning-sign",d="Torrent not loaded",e="text-danger"),a.statusClass="glyphicon-"+c,a.statusTitle=d,a.statusColor=e,a.btnClass="btn-"+f,a.btnIcon="glyphicon-"+g}else console.log("undefined")}}}),angular.module("utorrentNgwebuiApp").controller("DetailsDialogCtrl",["$scope","$modalInstance","torrent",function(a,b,c){a.torrent=c}]);
