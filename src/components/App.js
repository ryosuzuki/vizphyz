import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    this.state = {}
    this.mousedown = false
  }

  componentDidMount() {

  var cpstyle, gpbr, gpr, gpstyle, line, lineArray, offset, paper, path, pathArray, updatePath;

  paper = Snap(800, 400);

  gpstyle = {
    fill: "#725",
    stroke: "#ddd",
    strokeWidth: 2
  };

  cpstyle = {
    fill: "#387",
    stroke: "#ddd",
    strokeWidth: 2,
    opacity: 1
  };

  gpr = 7;

  gpbr = 11;

  offset = 8;

  path = paper.path("").mouseover(function() {
    return this.stop().animate({
      opacity: .7,
      strokeWidth: 7
    }, 100, mina.easeinout);
  }).mouseout(function() {
    return this.stop().animate({
      opacity: 1,
      strokeWidth: 3
    }, 600, mina.easeinout);
  }).attr({
    stroke: "#387",
    fill: "none",
    strokeWidth: 3
  });

  line = paper.path("").mouseover(function() {
    return this.stop().animate({
      opacity: 1
    }, 100, mina.easeinout);
  }).mouseout(function() {
    return this.stop().animate({
      opacity: .2
    }, 600, mina.easeinout);
  }).attr({
    stroke: "#772222",
    fill: "none",
    strokeWidth: 1,
    opacity: 1
  });

  pathArray = [];

  lineArray = [];

  updatePath = function() {
    var count, first, i, len, lineString, node, pathString, ref;
    first = pathArray[0];
    count = 0;
    pathString = "M " + first.x + "," + first.y;
    lineString = "";
    ref = pathArray.slice(1);
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      pathString += "Q " + node.cptx + "," + node.cpty + "," + node.x + "," + node.y + " ";
      lineString += "M " + node.cptx + "," + node.cpty + " L " + node.x + ", " + node.y + " ";
      line.attr({
        d: lineString
      });
    }
    return path.attr({
      d: pathString
    });
  };

  paper.mouseup(function(e) {
    var a, b, coords, cpoint, df, dt, pathString;
    // if (e.target.tagName === "svg" && e.button === 1) {
    console.log('mouse')
      paper.circle(e.layerX - offset, e.layerY - offset, gpbr).attr(gpstyle).data('i', pathArray.length).mouseover(function() {
        return this.stop().animate({
          r: gpbr
        }, 600, mina.elastic);
      }).mouseout(function() {
        return this.stop().animate({
          r: gpr
        }, 300, mina.easeinout);
      }).drag((function(dx, dy, x, y) {
        var currentNode;
        this.attr({
          cx: x - offset,
          cy: y - offset
        });
        currentNode = pathArray[this.data('i')];
        currentNode.x = x - offset;
        currentNode.y = y - offset;
        return updatePath();
      }));
      pathArray.push({
        x: e.layerX - offset,
        y: e.layerY - offset,
        cptx: e.layerX - offset,
        cpty: e.layerY - offset
      });
      dt = pathArray.length - 1;
      df = pathArray.length - 2;
      if (df > -1) {
        a = pathArray[dt].x - pathArray[df].x;
        b = pathArray[dt].y - pathArray[df].y;
        cpoint = paper.circle(pathArray[df].x + (a / 3), pathArray[df].y + (b / 3), 3).mouseover(function() {
          return this.stop().animate({
            r: 10
          }, 100, mina.easeinout);
        }).mouseout(function() {
          return this.stop().animate({
            r: 3
          }, 600, mina.easeinout);
        }).attr(cpstyle).drag((function(dx, dy, x, y) {
          return this.attr({
            cx: x - offset,
            cy: y - offset
          }, pathArray[dt].cptx = x - offset, pathArray[dt].cpty = y - offset, updatePath());
        }));
      }
      updatePath();
      pathString = path.attr('d');
      coords = (e.layerX - offset) + "," + (e.layerY - offset);
      return path.attr({
        d: pathString ? pathString + (" L " + coords) : "M " + coords
      });
    // }
  });

    const container = document.querySelector("#container");
    paper.prependTo(container);


    /*
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.paper = Snap(this.width, this.height).remove();

    this.paper.mousedown((e) => {
      this.onMouseDown(e)
    })
    this.paper.mousemove((e) => {
      this.onMouseMove(e)
    })
    this.paper.mouseup((e) => {
      this.onMouseUp(e)
    })

    const container = document.querySelector("#container");
    this.paper.prependTo(container);
    this.segments = []
    */
  }

  onMouseDown(e) {
    console.log('mouse down')
    this.mousedown = true
    const pos = this.getCursor(e)
    this.current = {}
    this.current.point = pos
  }

  onMouseMove(e) {
    if (!this.mousedown) return false
    console.log('mouse move')
    console.log(this.getCursor(e))
  }

  onMouseUp(e) {
    console.log('mouse up')
    this.mousedown = false
    const pos = this.getCursor(e)
    const anchor = {
      x: 2 * this.current.point.x - pos.x,
      y: 2 * this.current.point.y - pos.y
    }
    this.current.anchor = anchor
    this.segments.push(this.current)
    this.draw()
  }

  draw() {
    const start = this.segments[0]
    let d = ''
    d += `M ${start.point.x} ${start.point.y}`

    for (let i = 1; i < this.segments.length; i++) {
      const prev = this.segments[i-1]
      const current = this.segments[i]
      if (i === 1) {
        d += 'C '
        d += `${prev.anchor.x} ${prev.anchor.y} `
        d += `${current.anchor.x} ${current.anchor.y} `
        d += `${current.point.x} ${current.point.y} `
      } else {
        d += 'S '
        d += `${current.anchor.x} ${current.anchor.y} `
        d += `${current.point.x} ${current.point.y} `
      }
    }
    if (!this.path) {
      this.path = this.paper.path(d)
    } else {
      this.path.attr('d', d)
    }
    return false
    /*
    const start = this.line[0]
    path += `M ${start.down.x} ${start.down.y}`
    for (let i = 1; i < this.line.length; i++) {
      const prev = this.line[i-1]
      const point = this.line[i]
      path += 'C '
      path += `${prev.up.x} ${prev.up.y} `
      path += `${point.down.x} ${point.down.y} `
      path += `${point.down.x} ${point.down.y} `
    }
    console.log(path)
    this.path = this.paper.path(path)
    */
  }

  getCursor(e) {
    const m = (Snap.matrix(this.paper.node.getScreenCTM())).invert()
    const ex = e.clientX
    const ey = e.clientY
    return { x: m.x(ex, ey), y: m.y(ex, ey) }
  }

  render() {
    return (
      <div>
        <div id="container"></div>
      </div>
    )
  }
}

export default App

