(function() {
  var canvas = document.querySelector("[data-home-matrix]");

  if (!canvas) {
    return;
  }

  var context = canvas.getContext("2d");
  var COLUMN_COUNT = 128;
  var STEP_MS = 62.5;

  if (!context) {
    return;
  }

  var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var resizeObserver = null;
  var animationFrameId = 0;
  var lastStepTime = 0;
  var geometry = null;
  var cells = [];
  var injectionBudget = 0;

  function createCells(rows, columns) {
    var nextCells = [];
    var row = 0;
    var column = 0;

    for (row = 0; row < rows; row += 1) {
      nextCells[row] = [];
      for (column = 0; column < columns; column += 1) {
        nextCells[row][column] = 0;
      }
    }

    return nextCells;
  }

  function getGeometry(width, height) {
    var columns = COLUMN_COUNT;
    var pitch = width / columns;
    var diameter = pitch / 2;
    var radius = diameter / 2;
    var rows = Math.max(1, Math.floor(height / pitch));
    var gridWidth = (columns - 1) * pitch + diameter;
    var gridHeight = (rows - 1) * pitch + diameter;

    return {
      columns: columns,
      rows: rows,
      pitch: pitch,
      radius: radius,
      offsetX: (width - gridWidth) / 2 + radius,
      offsetY: (height - gridHeight) / 2 + radius,
      width: width,
      height: height
    };
  }

  function ensureCells(rows, columns) {
    if (cells.length === rows && cells[0] && cells[0].length === columns) {
      return;
    }

    cells = createCells(rows, columns);
  }

  function resizeCanvas() {
    var bounds = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var width = Math.max(1, Math.round(bounds.width));
    var height = Math.max(1, Math.round(bounds.height));

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);

    geometry = getGeometry(width, height);
    ensureCells(geometry.rows, geometry.columns);
    draw();
  }

  function draw() {
    var row = 0;
    var column = 0;
    var styles = window.getComputedStyle(document.documentElement);
    var fillColor = styles.getPropertyValue("--matrix-dot").trim() || "rgba(255, 255, 255, 0.2)";

    if (!geometry) {
      return;
    }

    context.clearRect(0, 0, geometry.width, geometry.height);
    context.fillStyle = fillColor;

    for (row = 0; row < geometry.rows; row += 1) {
      for (column = 0; column < geometry.columns; column += 1) {
        if (!cells[row][column]) {
          continue;
        }

        context.beginPath();
        context.arc(
          geometry.offsetX + column * geometry.pitch,
          geometry.offsetY + row * geometry.pitch,
          geometry.radius,
          0,
          Math.PI * 2
        );
        context.fill();
      }
    }
  }

  function countNeighbors(row, column) {
    var count = 0;
    var rowOffset = 0;
    var columnOffset = 0;

    for (rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
        var neighborRow = 0;
        var neighborColumn = 0;

        if (rowOffset === 0 && columnOffset === 0) {
          continue;
        }

        neighborRow = (row + rowOffset + geometry.rows) % geometry.rows;
        neighborColumn = (column + columnOffset + geometry.columns) % geometry.columns;
        count += cells[neighborRow][neighborColumn];
      }
    }

    return count;
  }

  function shouldSkipIsolatedFlip(row, column) {
    var area = geometry.rows * geometry.columns;
    var skipProbability = 1 - 1 / Math.sqrt(area);

    return countNeighbors(row, column) === 0 && Math.random() < skipProbability;
  }

  function step() {
    var nextCells = [];
    var row = 0;
    var column = 0;
    var birthCount = 0;
    var totalCells = geometry.rows * geometry.columns;
    var targetChanges = Math.max(1, Math.floor(totalCells / 128));
    var error = 0;

    for (row = 0; row < geometry.rows; row += 1) {
      nextCells[row] = [];
      for (column = 0; column < geometry.columns; column += 1) {
        var neighbors = countNeighbors(row, column);
        var isAlive = cells[row][column] === 1;

        if (isAlive && (neighbors === 2 || neighbors === 3)) {
          nextCells[row][column] = 1;
        } else if (!isAlive && neighbors === 3) {
          nextCells[row][column] = 1;
        } else {
          nextCells[row][column] = 0;
        }

        if (cells[row][column] === 0 && nextCells[row][column] === 1) {
          birthCount += 1;
        }
      }
    }

    error = Math.max(0, targetChanges - birthCount);
    injectionBudget += 1;

    if (error < injectionBudget) {
      injectionBudget = error;
    }

    injectRandomFlips(nextCells, injectionBudget);
    cells = nextCells;
  }

  function injectRandomFlips(grid, flipCount) {
    var chosen = new Set();
    var totalCells = geometry.rows * geometry.columns;

    if (flipCount <= 0) {
      return;
    }

    while (chosen.size < flipCount && chosen.size < totalCells) {
      var index = Math.floor(Math.random() * totalCells);

      if (chosen.has(index)) {
        continue;
      }

      if (shouldSkipIsolatedFlip(
        Math.floor(index / geometry.columns),
        index % geometry.columns
      )) {
        continue;
      }

      chosen.add(index);
      grid[Math.floor(index / geometry.columns)][index % geometry.columns] ^= 1;
    }
  }

  function tick(timestamp) {
    if (!lastStepTime) {
      lastStepTime = timestamp;
    }

    if (!reducedMotionQuery.matches && timestamp - lastStepTime >= STEP_MS) {
      step();
      draw();
      lastStepTime = timestamp;
    }

    animationFrameId = window.requestAnimationFrame(tick);
  }

  function handleMotionPreferenceChange() {
    lastStepTime = 0;
    draw();
  }

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
  } else {
    window.addEventListener("resize", resizeCanvas);
  }

  if ("addEventListener" in reducedMotionQuery) {
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);
  } else if ("addListener" in reducedMotionQuery) {
    reducedMotionQuery.addListener(handleMotionPreferenceChange);
  }

  resizeCanvas();
  animationFrameId = window.requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", function() {
    if (document.hidden && animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      lastStepTime = 0;
      return;
    }

    if (!document.hidden && !animationFrameId) {
      animationFrameId = window.requestAnimationFrame(tick);
    }
  });

  var observer = new MutationObserver(draw);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
})();
