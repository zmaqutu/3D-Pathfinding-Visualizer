(this["webpackJsonp3d-pathfinding-project"]=this["webpackJsonp3d-pathfinding-project"]||[]).push([[0],{109:function(e,t,r){},110:function(e,t,r){},128:function(e,t,r){"use strict";r.r(t);var i=r(10),o=r(1),n=r.n(o),a=r(18),s=r.n(a),l=(r(109),r(110),r(9)),c=r(0),d=r.p+"static/media/floor_texture.9dabdb90.jpg",u=r(28),f=r.n(u),h=r(37),p=r(20),w=r(31),g=r(30);function v(e,t,r){return j.apply(this,arguments)}function j(){return(j=Object(h.a)(f.a.mark((function e(t,r,i){var o,n,a,s,l=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(o=l.length>3&&void 0!==l[3]?l[3]:300,n=l.length>4?l[4]:void 0,a=0;a<i.length;a++)new g.a.Tween(t.faces[1].color).to(i[a],o).onUpdate((function(){r.colorsNeedUpdate=!0})).delay(200*a).start(),new g.a.Tween(t.faces[2].color).to(i[a],o).onUpdate((function(){r.colorsNeedUpdate=!0})).delay(200*a).start();n&&n.position&&((s=["a","b","c"]).forEach((function(e){new g.a.Tween(r.vertices[t.faces[1][e]]).to({y:.5},o).onUpdate((function(){r.verticesNeedUpdate=!0})).start(),new g.a.Tween(r.vertices[t.faces[2][e]]).to({y:.5},o).onUpdate((function(){r.verticesNeedUpdate=!0})).start()})),s.forEach((function(e){new g.a.Tween(r.vertices[t.faces[1][e]]).to({y:0},o).onUpdate((function(){r.verticesNeedUpdate=!0})).delay(100).start(),new g.a.Tween(r.vertices[t.faces[2][e]]).to({y:0},o).onUpdate((function(){r.verticesNeedUpdate=!0})).delay(100).start()})));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function b(e,t,r,i,o,n){t.distance=0,t.direction="right","aStar"===o&&(t.totalDistance=0);for(var a=function(e){var t,r=[],i=Object(w.a)(e);try{for(i.s();!(t=i.n()).done;){var o=t.value;r.push.apply(r,Object(p.a)(o))}}catch(n){i.e(n)}finally{i.f()}return r}(e);a.length;){for(var s=m(a,o);"wall"===s.status&&a.length;)s=m(a,o);if(s.distance===1/0)return!1;if(i.push(s),s.status="visited",s.id===r.id)return"success!";"CLA"===o||"greedy"===o||"aStar"===o?O(e,s,t,r,o,n):"Dijkstra"===o&&O(e,s)}}function m(e,t){for(var r,i,o=0;o<e.length;o++)"aStar"===t?(!r||r.totalDistance>e[o].totalDistance||r.totalDistance===e[o].totalDistance&&r.heuristicDistance>e[o].heuristicDistance)&&(r=e[o],i=o):(!r||r.distance>e[o].distance)&&(r=e[o],i=o);return e.splice(i,1),r}function O(e,t,r,i,o,n){var a,s=function(e,t){var r=[],i=e.col,o=e.row;o>0&&r.push(t[o-1][i]);o<t.length-1&&r.push(t[o+1][i]);i>0&&r.push(t[o][i-1]);i<t[0].length-1&&r.push(t[o][i+1]);return r.filter((function(e){return"visited"!==e.stutus}))}(t,e),l=Object(w.a)(s);try{for(l.s();!(a=l.n()).done;){var c=a.value;i?S(t,c,r,i,o,n):S(t,c)}}catch(d){l.e(d)}finally{l.f()}}function S(e,t,r,i,o,n){var a,s=function(e,t){var r=e.row,i=e.col,o=t.row,n=t.col;if(o<r&&i===n){if("up"===e.direction)return[1,["f"],"up"];if("right"===e.direction)return[2,["l","f"],"up"];if("left"===e.direction)return[2,["r","f"],"up"];if("down"===e.direction)return[3,["r","r","f"],"up"];if("up-right"===e.direction)return[1.5,null,"up"];if("down-right"===e.direction)return[2.5,null,"up"];if("up-left"===e.direction)return[1.5,null,"up"];if("down-left"===e.direction)return[2.5,null,"up"]}else if(o>r&&i===n){if("up"===e.direction)return[3,["r","r","f"],"down"];if("right"===e.direction)return[2,["r","f"],"down"];if("left"===e.direction)return[2,["l","f"],"down"];if("down"===e.direction)return[1,["f"],"down"];if("up-right"===e.direction)return[2.5,null,"down"];if("down-right"===e.direction)return[1.5,null,"down"];if("up-left"===e.direction)return[2.5,null,"down"];if("down-left"===e.direction)return[1.5,null,"down"]}if(n<i&&r===o){if("up"===e.direction)return[2,["l","f"],"left"];if("right"===e.direction)return[3,["l","l","f"],"left"];if("left"===e.direction)return[1,["f"],"left"];if("down"===e.direction)return[2,["r","f"],"left"];if("up-right"===e.direction)return[2.5,null,"left"];if("down-right"===e.direction)return[2.5,null,"left"];if("up-left"===e.direction)return[1.5,null,"left"];if("down-left"===e.direction)return[1.5,null,"left"]}else if(n>i&&r===o){if("up"===e.direction)return[2,["r","f"],"right"];if("right"===e.direction)return[1,["f"],"right"];if("left"===e.direction)return[3,["r","r","f"],"right"];if("down"===e.direction)return[2,["l","f"],"right"];if("up-right"===e.direction)return[1.5,null,"right"];if("down-right"===e.direction)return[1.5,null,"right"];if("up-left"===e.direction)return[2.5,null,"right"];if("down-left"===e.direction)return[2.5,null,"right"]}}(e,t);if(i&&"CLA"===o){var l=15===t.weight?15:1;"manhattanDistance"===n?a=e.distance+(s[0]+l)*P(t,i):"poweredManhattanDistance"===n?a=e.distance+t.weight+s[0]+Math.pow(P(t,i),2):"extraPoweredManhattanDistance"===n&&(a=e.distance+(s[0]+l)*Math.pow(P(t,i),7))}else i&&"greedy"===o?a=t.weight+s[0]+P(t,i):"aStar"===o?(t.heuristicDistance||(t.heuristicDistance=P(t,i)),a=e.distance+t.weight+s[0]):a=e.distance+t.weight+s[0];a<t.distance&&(t.distance=a,t.previousNode=e,t.path=s[1],t.direction=s[2],"aStar"===o&&(t.totalDistance=t.distance+t.heuristicDistance))}function P(e,t){var r=[e.row,e.col],i=[t.row,t.col];return Math.abs(r[0]-i[0])+Math.abs(r[1]-i[1])}function x(e,t,r,i,o,n,a,s,l){if(!(r<t||o<i)){var c=["start","finish"];if(!a){var d,u;for(u=0;u<e[0].length;u++)N(e[d=0][u]);for(u=0;u<e[0].length;u++)N(e[d=e.length-1][u]);for(d=1;d<e.length-1;d++)u=0,N(e[d][u]);for(d=1;d<e.length-1;d++)u=e[0].length-1,N(e[d][u]);a=!0}if("horizontal"===n){for(var f=[],h=t;h<=r;h+=2)f.push(h);for(var p=[],w=i-1;w<=o+1;w+=2)p.push(w);var g,v=Math.floor(Math.random()*f.length),j=Math.floor(Math.random()*p.length),b=f[v],m=p[j],O=b;for(g=i-1;g<=o+1;g++)g!==m&&N(e[O][g]);x(e,t,b-2,i,o,b-2-t>o-i?n:"vertical",a,s,l),x(e,b+2,r,i,o,r-(b+2)>o-i?n:"vertical",a,s,l)}else{for(var S=[],P=i;P<=o;P+=2)S.push(P);for(var M=[],y=t-1;y<=r+1;y+=2)M.push(y);var D,C=Math.floor(Math.random()*S.length),F=Math.floor(Math.random()*M.length),R=S[C],z=M[F],k=R;for(D=t-1;D<=r+1;D++)D!==z&&N(e[D][k]);x(e,t,r,i,R-2,r-t>R-2-i?"horizontal":n,a,s,l),x(e,t,r,R+2,o,r-t>o-(R+2)?"horizontal":n,a,s,l)}}function N(e){c.includes(e.status)||(s.push(e),"wall"===l?e.weight=0:"weight"===l&&(e.weight=15))}}var M=function(e){var t,r,n,a=0,s=0,u=!0,f=Object(o.useState)(new c.PlaneGeometry(300,300,30,30)),h=Object(l.a)(f,2),p=h[0],w=(h[1],e.selectedAlgorithm),j=e.selectedMazeAlgorithm,m=e.worldProperties.runState,O=e.worldProperties.clearWalls,S=e.worldProperties.clearPath,P=e.algorithmSpeed;Object(o.useEffect)((function(){if(!0===e.worldProperties.runState)!function(){console.log("Dijkstra Dijkstra Dijkstra"),T();var t,r=[],i=F.grid[e.worldProperties.start.row][e.worldProperties.start.col],o=F.grid[e.worldProperties.finish.row][e.worldProperties.finish.col];"weighted"===w.type?(t=b(F.grid,i,o,r,w.algorithm,w.heuristic),console.log(t)):t=function(e,t,r,i,o){for(var n=[t],a={start:!0},s=function(){var s="BFS"===o?n.shift():n.pop();if(i.push(s),"DFS"===o&&(a[s.id]=!0),s.status="visited",s.id===r.id)return{v:"success!"};(function(e,t,r){var i,o=[],n=e.col,a=e.row;return a>0&&(i=t[a-1][n],"BFS"===r?o.push(i):o.unshift(i)),a<t.length-1&&(i=t[a+1][n],"BFS"===r?o.push(i):o.unshift(i)),n>0&&(i=t[a][n-1],"BFS"===r?o.push(i):o.unshift(i)),n<t[0].length-1&&(i=t[a][n+1],"BFS"===r?o.push(i):o.unshift(i)),o.filter((function(e){return"visited"!==e.stutus}))})(s,e,o).forEach((function(e){a[e.id]||("BFS"===o&&(a[e.id]=!0),e.id!==t.id&&(e.previousNode=s),n.push(e))}))};n.length;){var l=s();if("object"===typeof l)return l.v}return!1}(F.grid,i,o,r,w.algorithm);var n=function(e){var t=[],r=e;for(null!==r.previousNode&&(r=r.previousNode);null!==r&&null!==r.previousNode;)t.unshift(r),r=r.previousNode;return t}(o);!function(t,r,i){for(var o=function(o){return o===t.length?(setTimeout((function(){!function(t,r){for(var i=function(i){setTimeout((function(){v(t[i],p,[e.worldProperties.colors.path],void 0,{position:!1}),t.length}),r*i)},o=0;o<t.length;o++)i(o);e.updateRunState(!1),console.log(F.grid[5][5])}(r,5*i)}),i*o),{v:void 0}):t[o].row===e.worldProperties.start.row&&t[o].col===e.worldProperties.start.col||t[o].row===e.worldProperties.finish.row&&t[o].col===e.worldProperties.finish.col?"continue":void setTimeout((function(){var r=t[o];r&&v(r,p,[{r:1,g:.321,b:.784},e.worldProperties.colors.visited],300,{position:!1})}),i*o)},n=0;n<=t.length;n++){var a=o(n);if("continue"!==a&&"object"===typeof a)return a.v}}(r,n,P)}();else if(!0===e.worldProperties.clearWalls)N();else if(!0===e.worldProperties.clearPath)T();else if("randomMaze"===e.selectedMazeAlgorithm){T();var t=[];!function(e,t,r){for(var i=0;i<e.length;i++)for(var o=0;o<e[0].length;o++){var n=Math.random(),a=e[i][o];n<("wall"===r?.25:.35)&&!["start","finish"].includes(a.status)&&(t.push(a),"wall"===r?a.weight=0:"weight"===r&&(a.weight=15))}}(F.grid,t,"wall"),A(t,"wall",30)}else if("recursiveDivision"===e.selectedMazeAlgorithm){T();var r=[];x(F.grid,2,F.grid.length-3,2,F.grid.length-3,"horizontal",!1,r,"wall"),A(r,"wall",30)}}),[m,O,S,j]);var M=Object(o.useMemo)((function(){return(new c.TextureLoader).load(d,(function(e){e.wrapS=c.RepeatWrapping,e.wrapT=c.RepeatWrapping,e.repeat.x=30,e.repeat.y=30,t=new c.MeshLambertMaterial({map:e,side:c.FrontSide,vertexColors:c.FaceColors}),new c.Mesh(p,t).receiveShadow=!0}))}),[d]);t=new c.MeshLambertMaterial({map:M,side:c.FrontSide,vertexColors:c.FaceColors});var y=Object(o.useRef)(null),D=Object(o.useState)({grid:function(){for(var e=[],t=0;t<30;t++){for(var r=[],i=0;i<30;i++){var o=R(t,i);r.push(o)}e.push(r)}return z(),e}()}),C=Object(l.a)(D,2),F=C[0];function R(t,r){var i="default",o={},n=2*t*e.worldProperties.cols+2*r;o[1]=p.faces[n],n=n%2===0?n+1:n-1,o[2]=p.faces[n],t===e.worldProperties.start.row&&r===e.worldProperties.start.col?i="start":t===e.worldProperties.finish.row&&r===e.worldProperties.finish.col&&(i="finish");var a={id:t*e.worldProperties.cols+r,row:t,col:r,faces:o,status:i,distance:1/0,totalDistance:1/0,heuristicDistance:null,direction:null,weight:0,previousNode:null};return"start"===i?v(a,p,[e.worldProperties.colors.start]):"finish"===i&&v(a,p,[e.worldProperties.colors.finish]),a}function z(){window.requestAnimationFrame(z),function(){if(u||n===r)return;r=n;var t=Math.floor(n/e.worldProperties.rows),i=n%e.worldProperties.cols;if(t===e.worldProperties.start.row&&i===e.worldProperties.start.col||t===e.worldProperties.finish.row&&i===e.worldProperties.finish.col)return;"wall"===F.grid[t][i].status?(F.grid[t][i].status="default",v(F.grid[t][i],p,[e.worldProperties.colors.default])):(F.grid[t][i].status="wall",v(F.grid[t][i],p,[e.worldProperties.colors.wall]))}(),g.a.update()}function k(t){if(a===t.clientX&&s===t.clientY){var r=function(t){var r=Math.floor(t/2);return{nodeRow:Math.floor(r/e.worldProperties.rows),nodeCol:r%e.worldProperties.cols}}(t.faceIndex);r.nodeRow===e.worldProperties.start.row&&r.nodeCol===e.worldProperties.start.col||r.nodeRow===e.worldProperties.finish.row&&r.nodeCol===e.worldProperties.finish.col||("wall"===F.grid[r.nodeRow][r.nodeCol].status?(F.grid[r.nodeRow][r.nodeCol].status="default",v(F.grid[r.nodeRow][r.nodeCol],p,[e.worldProperties.colors.default]),console.log(F.grid[r.nodeRow][r.nodeCol])):(F.grid[r.nodeRow][r.nodeCol].status="wall",v(F.grid[r.nodeRow][r.nodeCol],p,[e.worldProperties.colors.wall]),console.log(F.grid[r.nodeRow][r.nodeCol])))}}function N(){for(var t=0;t<e.worldProperties.rows;t++)for(var r=0;r<e.worldProperties.cols;r++)"wall"===F.grid[t][r].status&&(F.grid[t][r].status="default",v(F.grid[t][r],p,[e.worldProperties.colors.default]));e.stopClearWalls()}function T(){g.a.removeAll();for(var t=0;t<e.worldProperties.rows;t++)for(var r=0;r<e.worldProperties.cols;r++)t===e.worldProperties.start.row&&r===e.worldProperties.start.col&&(F.grid[t][r].status="start"),t===e.worldProperties.finish.row&&r===e.worldProperties.finish.col&&(F.grid[t][r].status="finish"),"visited"===F.grid[t][r].status&&(F.grid[t][r].status="default",v(F.grid[t][r],p,[e.worldProperties.colors.default])),F.grid[t][r].distance=1/0,F.grid[t][r].totalDistance=1/0,F.grid[t][r].heuristicDistance=null,F.grid[t][r].direction=null,F.grid[t][r].previousNode=null;e.stopClearPath()}function A(t,r,i){N();for(var o=function(r){var o=t[r].row,n=t[r].col;setTimeout((function(){F.grid[o][n].status="wall",v(F.grid[o][n],p,[e.worldProperties.colors.wall])}),i*r),e.stopMazeSelection()},n=0;n<t.length;n++)o(n)}return C[1],Object(i.jsxs)("mesh",{ref:y,position:[0,0,-10],children:[Object(i.jsx)("gridHelper",{args:[300,e.gridDimensions,6060221,6060221]}),Object(i.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.1,0],receiveShadow:!0,onPointerDown:function(e){var t;u=!1,a=(t=e).clientX,s=t.clientY},onPointerUp:function(t){!0!==e.resetStatus&&!0!==u||(u=!0),k(t)},onPointerMove:function(t){!0!==u&&!1!==e.resetStatus&&(!1!==u||(n=Math.floor(t.faceIndex/2)))},children:[Object(i.jsx)("primitive",{attach:"geometry",object:p}),Object(i.jsx)("primitive",{attach:"material",object:t})]}),Object(i.jsx)("axesHelper",{})]})},y=r(13);var D=function(){return Object(i.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-3,-5],children:[Object(i.jsx)("planeBufferGeometry",{attach:"geometry",args:[5e3,5e3,30,30]}),Object(i.jsx)("meshStandardMaterial",{attach:"material",color:"white"})]})},C=r(95);var F=function(e){var t=e.resetStatus,r=Object(y.g)().camera,n=Object(o.useRef)();return Object(o.useEffect)((function(){!0===e.resetStatus&&(g.a.removeAll(),new g.a.Tween(r.position).to({x:0,y:380,z:0},2e3).easing(g.a.Easing.Exponential.Out).onComplete((function(){n.current.update()})).start())}),[t]),Object(i.jsx)(C.a,{ref:n,enableRotate:!e.resetStatus})},R=r(161),z=r(162),k=r(160),N=r(93),T=r.n(N),A=r(94),B=r.n(A),U=r(78),E=r.n(U),I=r(156);var L=function(e){var t=window.innerWidth,r=window.innerHeigh,n=Object(o.useState)({}),a=Object(l.a)(n,2),s=a[0],c=a[1],d=Object(o.useState)(!1),u=Object(l.a)(d,2),f=u[0],h=u[1],p=Object(o.useState)(!1),w=Object(l.a)(p,2),g=w[0],v=w[1],j=Object(o.useState)(!1),b=Object(l.a)(j,2),m=b[0],O=b[1],S=Object(o.useState)(!1),P=Object(l.a)(S,2),x=P[0],C=P[1],N=Object(o.useRef)([0,350,0]),A=Object(o.useState)(""),U=Object(l.a)(A,2),L=U[0],W=U[1],H=Object(o.useState)("15"),G=Object(l.a)(H,2),J=G[0],X=G[1],Y=Object(o.useState)(!0),q=Object(l.a)(Y,2),V=q[0],_=q[1],K=Object(I.a)((function(e){return{root:{"& > *":{margin:e.spacing(1),background:"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",border:0,borderRadius:3,color:"white"}}}}))();return Object(i.jsxs)(i.Fragment,{children:[Object(i.jsxs)("div",{align:"center",className:K.root,children:[Object(i.jsxs)(R.a,{name:"algorithms",id:"algorithms",displayEmpty:!0,onChange:function(e){return void 0!==(t=e).target.value&&_(!1),void 0===t.target.value&&_(!0),void("Dijkstra"===t.target.value?c({algorithm:"Dijkstra",type:"weighted",heuristic:""}):"aStar"===t.target.value?c({algorithm:"aStar",type:"weighted",heuristic:"poweredManhattanDistance"}):"BFS"===t.target.value?c({algorithm:"BFS",type:"unweighted",heuristic:""}):"DFS"===t.target.value&&c({algorithm:"DFS",type:"unweighted",heuristic:""}));var t},children:[Object(i.jsx)(z.a,{children:"Select Algorithm"}),Object(i.jsx)(z.a,{value:"Dijkstra",children:"Dijkstra's Algorithm"}),Object(i.jsx)(z.a,{value:"aStar",children:"A* Search"}),Object(i.jsx)(z.a,{value:"BFS",children:"Breadth First Search"}),Object(i.jsx)(z.a,{value:"DFS",children:"Depth First Search"})]}),Object(i.jsxs)(R.a,{name:"mazes",id:"mazes",displayEmpty:!0,onChange:function(e){W(e.target.value)},children:[Object(i.jsx)(z.a,{children:"Select Maze"}),Object(i.jsx)(z.a,{value:"randomMaze",children:"Random Maze"}),Object(i.jsx)(z.a,{value:"recursiveDivision",children:"Recursive Division"})]}),Object(i.jsx)(k.a,{id:"button1zo",onClick:function(e){return h(!0)},variant:"outlined",disabled:f||V,startIcon:Object(i.jsx)(T.a,{}),children:"Vizualize"}),Object(i.jsx)(k.a,{onClick:function(e){return C(!0)},variant:"outlined",disabled:f,startIcon:Object(i.jsx)(E.a,{}),children:"Clear Path"}),Object(i.jsx)(k.a,{onClick:function(e){return O(!0)},variant:"outlined",disabled:f,startIcon:Object(i.jsx)(E.a,{}),children:"Clear Walls"}),Object(i.jsx)(k.a,{onClick:function(e){return v(!g)},variant:"outlined",startIcon:Object(i.jsx)(B.a,{}),children:"Setup World"}),Object(i.jsxs)(R.a,{name:"algorithmSpeed",id:"algorithmSpeed",displayEmpty:!0,onChange:function(e){return X(e.target.value)},children:[Object(i.jsx)(z.a,{children:"Select Speed"}),Object(i.jsx)(z.a,{value:"15",children:"Fast"}),Object(i.jsx)(z.a,{value:"25",children:"Medium"}),Object(i.jsx)(z.a,{value:"80",children:"Slow"})]})]}),Object(i.jsxs)(y.a,{colorManagement:!0,camera:{position:N.current,fov:52.5,aspect:t/r,far:5e3},children:[Object(i.jsx)("ambientLight",{intensity:1,color:12305104}),Object(i.jsx)("hemisphereLight",{color:"hsl(0.6, 1, 0.6)",groundColor:8877917,intensity:.1,position:[0,5,0]}),Object(i.jsx)("directionalLight",{color:"hsl(0.1, 1, 0.95)",groundColor:8877917,intensity:.5,position:[-70,122.5,70],castShadow:!0}),Object(i.jsx)(M,{gridDimensions:30,updateRunState:function(e){h(e)},stopClearPath:function(){C(!1)},stopClearWalls:function(){O(!1)},stopMazeSelection:function(){W("")},resetStatus:g,selectedAlgorithm:s,selectedMazeAlgorithm:L,algorithmSpeed:J,worldProperties:{rows:30,cols:30,runState:f,clearPath:x,clearWalls:m,start:{row:5,col:5},finish:{row:25,col:25},colors:{start:{r:0,g:1,b:0},finish:{r:1,g:0,b:0},wall:{r:.109,g:.109,b:.45},visited:{r:.329,g:.27,b:.968},path:{r:1,g:1,b:0},default:{r:1,g:1,b:1}},nodeDimensions:{height:10,width:10}}}),Object(i.jsx)(D,{}),Object(i.jsx)(F,{resetStatus:g,updateResetStatus:function(){v(!1)}})]})]})};var W=function(){return Object(i.jsx)(i.Fragment,{children:Object(i.jsx)(L,{})})},H=function(e){e&&e instanceof Function&&r.e(3).then(r.bind(null,164)).then((function(t){var r=t.getCLS,i=t.getFID,o=t.getFCP,n=t.getLCP,a=t.getTTFB;r(e),i(e),o(e),n(e),a(e)}))};s.a.render(Object(i.jsx)(n.a.StrictMode,{children:Object(i.jsx)(W,{})}),document.getElementById("root")),H()}},[[128,1,2]]]);
//# sourceMappingURL=main.d15b156f.chunk.js.map