import * as React from 'react'
import { InteractiveDataProps, InteractiveDataState } from '../common/Chart'
import { YtInteractiveChartHelper } from "../common/YtInteractiveChartHelper"
import { YtModel, ChannelData } from '../common/YtModel'
import { compactInteger } from 'humanize-plus'
import * as _ from 'lodash'
import { SearchChannels } from '../components/SearchChannels'
import * as dateformat from 'dateformat'
import { Dim } from '../common/Dim'

interface State extends InteractiveDataState { }
interface Props extends InteractiveDataProps<YtModel> { }

export class ChannelTitle extends React.Component<Props, State> {
  chart: YtInteractiveChartHelper = new YtInteractiveChartHelper(this)
  state: Readonly<State> = {
    selections: this.props.model.selectionState
  }

  get dim(): Dim<ChannelData> {
    return this.props.model.channelDim
  }

  channel() {
    const channelId = this.chart.selections
      .highlitedOrSelectedValue(this.dim.col("channelId"))
    return channelId ? this.props.model.channels.find(c => c.channelId == channelId) : null
  }

  tagAlias: Record<string, string> = {
    ManoelAltLite: 'Ribeiro - Alt-light',
    ManoelAltRight: 'Ribeiro - Alt-right',
    ManoelIDW: 'Ribeiro - IDW',
    ManoelControl: 'Ribeiro - Control',
    AntiSJW: 'Anti-SJW',
    SocialJusticeL: 'Social Justice',
    WhiteIdentitarian: 'White Identitarian',
    PartisanLeft: 'Partisan Left',
    PartisanRight: 'Partisan Right',
    AntiTheist: 'Anti-theist',
    ReligiousConservative: 'Religious Conservative',
    MissingLinkMedia: 'Missing Link Media',
    StateFunded: 'State Funded',
    AntiWhiteness: 'Anti-whiteness',
    LateNightTalkShow: '_',
    Revolutionary: '_'
  }

  render() {
    let channel = this.channel()
    let fdate = (d: string) => d ? dateformat(new Date(d), 'd mmm yyyy') : d

    const renderChannel = (c: ChannelData) => {
      let tags = c.tags.length == 0 ? ['None'] : c.tags.map(t => this.tagAlias[t] ?? t).filter(t => t != '_')
      return (<>
        <a href={`https://www.youtube.com/channel/${c.channelId}`} target="blank">
          <img src={c.thumbnail} style={{ height: '7em', marginRight: '1em', clipPath: 'circle()' }} />
        </a>
        <div className="title-details">
          <div><b>{c.title}</b></div>
          <div><b>{compactInteger(c.relevantDailyViews)}</b> relevant daily views (<i>{fdate(c.publishedFrom)}</i> - <i>{fdate(c.publishedTo)}</i>)</div>
          <div><b>{compactInteger(c.subCount)}</b> subscribers</div>
          <div>{tags.map(t => (<span key={t} className={'tag'}>{t}</span>))}</div>
        </div>
      </>)
    }

    return (
      <div className={'Title'}>
        <div className={'Card'}>
          {channel == null ? (
            <div style={{}}>
              <h2>Recfluence</h2>
              <p>Analysis of YouTube's political inlfuence through recommendations</p>
            </div>
          ) : (
              renderChannel(channel)
            )}
        </div>
        <div className={'Search'} style={{}}>
          <SearchChannels model={this.props.model} onSelection={this.props.onSelection} selections={this.state.selections} />
        </div>
      </div>
    )
  }
}
