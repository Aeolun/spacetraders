import { createRoot } from 'react-dom/client'
import { useState, useEffect, useRef, PropsWithChildren, ReactNode } from 'react'
import {GraphCanvas, GraphCanvasRef, recommendLayout, useSelection} from 'reagraph';
import data from './graph'

const edges = []
const nodes = []
data.forEach(d => {
  if (nodes.find(i => i.id === d.imports) === undefined) {
    nodes.push({
      id: d.imports,
      label: d.imports
    })
  }
  if (nodes.find(i => i.id === d.export) === undefined) {
    nodes.push({
      id: d.export,
      label: d.export
    })
  }


  edges.push({
    id: d.imports +'->'+d.export,
    source: d.imports,
    target: d.export,
    size: Math.max(d.weight / 8, 1),
    label: d.weight
  })

})

const App = () => {
  const layout = recommendLayout(nodes, edges);
  const graphRef = useRef<GraphCanvasRef | null>(null);
  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut
  } = useSelection({
    ref: graphRef,
    nodes: nodes,
    edges: edges,
    pathHoverType: 'in',
    pathSelectionType: 'out'
  });

  return <GraphCanvas
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          layoutType={layout}
          sizingType={'pagerank'}
          labelType={'all'}
          selections={selections}
          actives={actives}
          onNodePointerOver={onNodePointerOver}
          onNodePointerOut={onNodePointerOut}
          onCanvasClick={onCanvasClick}
          onNodeClick={onNodeClick}
          // theme={{
          //     canvas: {
          //         background: 'rgba(0, 0, 0, 1)',
          //     },
          //     node: {
          //         fill: 'rgba(128, 128, 128, 0.5)',
          //         activeFill: 'rgba(128, 128, 128, 0.5)',
          //         opacity: 1,
          //         selectedOpacity: 1,
          //         inactiveOpacity: 1,
          //         label: {
          //             stroke: 'rgba(128, 128, 128, 0.5)',
          //             color: 'rgba(128, 128, 128, 0.5)',
          //             activeColor: 'rgba(128, 128, 128, 0.5)',
          //         }
          //     },
          //     ring: {
          //         fill: 'rgba(128, 128, 128, 0.5)',
          //         activeFill: 'rgba(128, 128, 128, 0.5)',
          //     },
          //     edge: {
          //         fill: 'rgba(128, 128, 128, 0.5)',
          //         activeFill: 'rgba(128, 128, 128, 0.5)',
          //         opacity: 1,
          //         selectedOpacity: 1,
          //         inactiveOpacity: 1,
          //         label: {
          //             stroke: 'rgba(128, 128, 128, 0.5)',
          //             color: 'rgba(128, 128, 128, 0.5)',
          //             activeColor: 'rgba(128, 128, 128, 0.5)',
          //         }
          //     },
          //     arrow: {
          //         fill: 'rgba(128, 128, 128, 0.5)',
          //         activeFill: 'rgba(128, 128, 128, 0.5)',
          //     },
          //     lasso: {
          //         background: 'rgba(128, 128, 128, 0.5)',
          //         border: 'rgba(128, 128, 128, 0.5)',
          //     },
          // }}
        />

}

const root = createRoot(document.getElementById('app'))
root.render(<App />)