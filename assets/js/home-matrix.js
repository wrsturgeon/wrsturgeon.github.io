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
  var flipStreaks = [];
  var injectionBudget = 0;
  var isPointerActive = false;
  var lastPointerPoint = null;
  var MAX_FLIP_STREAK = 12;

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
    flipStreaks = createCells(rows, columns);
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getCellFromPoint(clientX, clientY) {
    var bounds = canvas.getBoundingClientRect();
    var x = clientX - bounds.left;
    var y = clientY - bounds.top;

    if (!geometry) {
      return null;
    }

    return {
      row: clamp(
        Math.round((y - geometry.offsetY) / geometry.pitch),
        0,
        geometry.rows - 1
      ),
      column: clamp(
        Math.round((x - geometry.offsetX) / geometry.pitch),
        0,
        geometry.columns - 1
      )
    };
  }

  function activateCell(row, column) {
    if (!geometry) {
      return;
    }

    cells[row][column] = 1;
  }

  function activatePath(fromPoint, toPoint) {
    var dx = 0;
    var dy = 0;
    var distance = 0;
    var steps = 0;
    var stepIndex = 0;

    if (!geometry) {
      return;
    }

    dx = toPoint.x - fromPoint.x;
    dy = toPoint.y - fromPoint.y;
    distance = Math.max(Math.abs(dx), Math.abs(dy));
    steps = Math.max(1, Math.ceil(distance / Math.max(1, geometry.pitch / 2)));

    for (stepIndex = 0; stepIndex <= steps; stepIndex += 1) {
      var progress = stepIndex / steps;
      var cell = getCellFromPoint(
        fromPoint.x + dx * progress,
        fromPoint.y + dy * progress
      );

      if (cell) {
        activateCell(cell.row, cell.column);
      }
    }

    draw();
  }

  function handlePointerDown(event) {
    isPointerActive = true;
    lastPointerPoint = {
      x: event.clientX,
      y: event.clientY
    };

    if ("setPointerCapture" in canvas) {
      canvas.setPointerCapture(event.pointerId);
    }

    activatePath(lastPointerPoint, lastPointerPoint);
  }

  function handlePointerMove(event) {
    var nextPoint = null;

    if (!isPointerActive || !lastPointerPoint) {
      return;
    }

    nextPoint = {
      x: event.clientX,
      y: event.clientY
    };

    activatePath(lastPointerPoint, nextPoint);
    lastPointerPoint = nextPoint;
  }

  function handlePointerEnd(event) {
    if ("releasePointerCapture" in canvas && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    isPointerActive = false;
    lastPointerPoint = null;
  }

  function draw() {
    var row = 0;
    var column = 0;
    var styles = window.getComputedStyle(document.documentElement);
    var fillColor = styles.getPropertyValue("--matrix-dot").trim() || "#808080";

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
        neighborColumn = column + columnOffset;

        if (neighborColumn < 0) {
          continue;
        }

        if (neighborColumn >= geometry.columns) {
          continue;
        }

        count += cells[neighborRow][neighborColumn];
      }
    }

    return count;
  }

  function getActivationPenalty(row, column) {
    var horizontalPenalty = 0;
    var horizontalProgress = 0;
    var horizontalSteepness = 16;
    var verticalPenalty = 1;
    var verticalCenter = (geometry.rows - 1) / 2;

    if (geometry.columns > 1) {
      horizontalProgress = column / (geometry.columns - 1);
      horizontalPenalty = 1 / (1 + Math.exp(horizontalSteepness * (horizontalProgress - 0.5)));
    }

    if (verticalCenter > 0) {
      verticalPenalty = 1 - Math.abs(row - verticalCenter) / verticalCenter;
      verticalPenalty *= verticalPenalty;
    }

    return horizontalPenalty * verticalPenalty;
  }

  function shouldRejectActivation(row, column) {
    return Math.random() < getActivationPenalty(row, column);
  }

  function shouldSkipIsolatedFlip(row, column) {
    // If we're turning a dot off, prefer those on the left side of the screen.
    if (cells[row][column]) {
      return Math.random() * geometry.columns < column;
    }
    // Prefer activating dots on the right side of the screen.
    if (Math.random() * geometry.columns > column) {
      return true;
    }
    // Prefer dots with neighbors.
    if (countNeighbors(row, column) != 0) {
      return false;
    }
    // Otherwise, proceed anyway with some probability,
    // e.g. for cold starts.
    var area = geometry.rows * geometry.columns;
    var skipProbability = 0.1 / Math.sqrt(area);
    return Math.random() > skipProbability;
  }

  function step() {
    var nextCells = [];
    var nextFlipStreaks = [];
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
        } else if (!isAlive && neighbors === 3 && !shouldRejectActivation(row, column)) {
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

    for (row = 0; row < geometry.rows; row += 1) {
      nextFlipStreaks[row] = [];
      for (column = 0; column < geometry.columns; column += 1) {
        var didFlip = cells[row][column] !== nextCells[row][column];
        var nextFlipStreak = didFlip ? flipStreaks[row][column] + 1 : 0;

        if (nextFlipStreak >= MAX_FLIP_STREAK) {
          nextCells[row][column] = 0;
          nextFlipStreaks[row][column] = 0;
          continue;
        }

        nextFlipStreaks[row][column] = nextFlipStreak;
      }
    }

    cells = nextCells;
    flipStreaks = nextFlipStreaks;
  }

  function injectRandomFlips(grid, flipCount) {
    var chosen = new Set();
    var totalCells = geometry.rows * geometry.columns;

    if (flipCount <= 0) {
      return;
    }

    while (chosen.size < flipCount && chosen.size < totalCells) {
      var index = Math.floor(Math.random() * totalCells);
      var row = Math.floor(index / geometry.columns);
      var column = index % geometry.columns;

      if (chosen.has(index)) {
        continue;
      }

      if (shouldSkipIsolatedFlip(row, column)) {
        continue;
      }

      if (grid[row][column] === 0 && shouldRejectActivation(row, column)) {
        continue;
      }

      chosen.add(index);
      grid[row][column] ^= 1;
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
  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerEnd);
  canvas.addEventListener("pointercancel", handlePointerEnd);

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
