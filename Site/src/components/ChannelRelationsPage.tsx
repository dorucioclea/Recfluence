import * as React from 'react'
import ContainerDimensions from 'react-container-dimensions'
import { RecommendFlows } from './RecommendFlows'
import { ChannelRelations } from './ChannelRelations'
import { YtData, YtNetworks } from '../common/YtData'
import { GridLoader } from 'react-spinners'
import { DataSelections, DataSelection, SelectionType, ChartProps, InteractiveDataState, InteractiveDataProps } from '../common/Charts'
import { ChannelTitle } from './ChannelTitle'
import '../styles/Main.css'
import { navigate,  } from "gatsby"

interface Props {}

interface State {
  isLoading: boolean
  data?: YtData
}

export class ChannelRelationsPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.selections = new DataSelections()
  }

  state: Readonly<State> = {
    isLoading: false,
    data: null
  }

  selections: DataSelections
  relations: ChannelRelations
  flows: RecommendFlows
  title: ChannelTitle

  componentDidMount() {
    const params = new URLSearchParams(location.search)
    if (params.has('c')) {
      this.selections.filters.push({ path: YtNetworks.ChannelIdPath, values: [params.get('c')], type: SelectionType.Filter })
    }
    this.load()
  }

  async load() {
    if (this.state.isLoading) return
    let data = await YtNetworks.dataSet('https://ytnetworks.azureedge.net/data/results/')
    try {
      this.setState({ data, isLoading: false })
    } catch (e) {}
  }

  onSelection(selection: DataSelection) {
    this.selections.setSelection(selection)
    //let hist = createBrowserHistory()
    const params = new URLSearchParams(location.search)
    if ((selection.type == SelectionType.Filter && selection.path == YtNetworks.ChannelIdPath) || selection.path == null) {
      let channelId = selection.path == null ? null : selection.values.find(() => true)
      if (params.has('c')) params.delete('c')
      if (channelId) params.append('c', channelId)

      history.replaceState(null, '',`?${params}`)
    }

    this.updateComponentSelections()
  }

  private updateComponentSelections() {
    let components = this.graphComponents()
    components.forEach(g => g.setState({ selections: this.selections }))
  }

  graphComponents(): Array<React.Component<InteractiveDataProps<YtData>, InteractiveDataState>> {
    return [this.relations, this.flows, this.title].filter(g => g)
  }

  render() {
    if (this.state.data) {
      return (
        <div className={'ChannelRelationPage'}>
          <ChannelTitle
            ref={r => (this.title = r)}
            dataSet={this.state.data}
            onSelection={this.onSelection.bind(this)}
            initialSelection={this.selections}
          />

          <div className={'MainChartContainer'}>
            <div className={'Relations'}>
              <ContainerDimensions>
                {({ height, width }) => (
                  <ChannelRelations
                    ref={r => (this.relations = r)}
                    height={height}
                    width={width}
                    dataSet={this.state.data}
                    onSelection={this.onSelection.bind(this)}
                    initialSelection={this.selections}
                  />
                )}
              </ContainerDimensions>
            </div>
            <div className={'Flows'}>
              <ContainerDimensions>
                {({ height, width }) => (
                  <RecommendFlows
                    ref={r => (this.flows = r)}
                    height={height}
                    width={width}
                    dataSet={this.state.data}
                    onSelection={this.onSelection.bind(this)}
                    initialSelection={this.selections}
                  />
                )}
              </ContainerDimensions>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <GridLoader color="#3D5467" size={30} />
        </div>
      )
    }
  }
}