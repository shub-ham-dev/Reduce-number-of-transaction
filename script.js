import { BinaryHeap } from "./heap.js";
window.func = { submit, addNewRow };

var counter = 1;
function addNewRow() {
  // console.log(counter);
  counter += 1;
  let html =
    '<br/>\
    <div class="row" id="row' +
    counter +
    '">\
          <div class="col">\
            <input type="text" id = "from' +
    counter +
    '" class="form-control" placeholder="From"/>\
          </div>\
          <div class="col">\
            <input type="text" id = "to' +
    counter +
    '" class="form-control" placeholder="To"/>\
          </div>\
          <div class="col">\
            <input type="number" class="form-control" placeholder="Amount Pending" id = "amount' +
    counter +
    '">\
          </div>\
        </div>';

  var form = document.getElementById("inputForm");
  form.innerHTML += html;
}

function submit() {
  let input = document.getElementById("input");
  input.style.display = "none";

  let cont = document.getElementById("container");
  let random = document.getElementById("random");
  cont.style.display = "block";
  random.style.display = "block";

  const container = document.getElementById("mynetwork");
  const container2 = document.getElementById("mynetwork2");
  //   const genNew = document.getElementById("generate-graph");
  const solve = document.getElementById("solve");
  //   const temptext = document.getElementById("temptext");

  const options = {
    edges: {
      arrows: {
        to: true,
      },
      labelHighlightBold: true,
      font: {
        size: 20,
      },
    },
    nodes: {
      font: "12px arial red",
      scaling: {
        label: true,
      },
      shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "\uf183",
        size: 50,
        color: "#991133",
      },
    },
  };
  // initialize your network!
  let network = new vis.Network(container);
  network.setOptions(options);
  let network2 = new vis.Network(container2);
  network2.setOptions(options);
  let ids = 1;

  var hashMap = new Map();
  const edges = [];
  for (let i = 1; i <= counter; i++) {
    let from = document.getElementById("from" + String(i)).value;
    let to = document.getElementById("to" + String(i)).value;
    let amount = document.getElementById("amount" + String(i)).value;

    if (!hashMap.has(from)) {
      hashMap.set(from, ids);
      ids += 1;
    }

    if (!hashMap.has(to)) {
      hashMap.set(to, ids);
      ids += 1;
    }

    edges.push({
      from: hashMap.get(from),
      to: hashMap.get(to),
      label: String(amount),
    });
  }

  let nodes = [];
  hashMap.forEach((val, key) => {
    nodes.push({ id: val, label: key });
  });
  console.log(nodes);
  nodes = new vis.DataSet(nodes);
  const data = {
    nodes: nodes,
    edges: edges,
  };
  console.log(data);

  network.setData(data);

  solve.onclick = function () {
    container2.style.display = "inline";
    const solvedData = solveData(data);
    network2.setData(solvedData);
  };

  function solveData(data) {
    const sz = data['nodes'].length;
    const vals = Array(sz).fill(0);
    // Calculating net balance of each person
    for (let i = 0; i < counter; i++) {
      const edge = data["edges"][i];
      vals[edge["to"] - 1] += parseInt(edge["label"]);
      vals[edge["from"] - 1] -= parseInt(edge["label"]);
    }

    const pos_heap = new BinaryHeap();
    const neg_heap = new BinaryHeap();

    for (let i = 0; i < sz; i++) {
      if (vals[i] > 0) {
        pos_heap.insert([vals[i], i]);
      } else {
        neg_heap.insert([-vals[i], i]);
        vals[i] *= -1;
      }
    }

    const new_edges = [];
    while (!pos_heap.empty() && !neg_heap.empty()) {
      const mx = pos_heap.extractMax();
      const mn = neg_heap.extractMax();

      const amt = Math.min(mx[0], mn[0]);
      const to = mx[1];
      const from = mn[1];

      new_edges.push({
        from: from + 1,
        to: to + 1,
        label: String(Math.abs(amt)),
      });
      vals[to] -= amt;
      vals[from] -= amt;

      if (mx[0] > mn[0]) {
        pos_heap.insert([vals[to], to]);
      } else if (mx[0] < mn[0]) {
        neg_heap.insert([vals[from], from]);
      }
    }

    data = {
      nodes: data["nodes"],
      edges: new_edges,
    };
    return data;
  }
}
