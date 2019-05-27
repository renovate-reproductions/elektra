// The contents of this file are executed globally on every page load.
// see /app/javascript/packs/application.js for more infos!
import { useState, useEffect } from 'react'
import { createWidget } from 'widget'
import { pluginAjaxHelper, scope } from 'ajax_helper';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ajaxHelper = pluginAjaxHelper('resources')

const QuotaTooltip = (props) => {
  let tooltip = <Tooltip id='quotaTooltip'>
    Click to manage quotas
  </Tooltip>

  return (
    <OverlayTrigger
      overlay={tooltip}
      placement="top"
      delayShow={300}
      delayHide={150}
    >
      {props.children}
    </OverlayTrigger>
  )
}

const quotaInfos = document.querySelector('[data-react-quota-usage]')
const App = (props) => {

  const [usage, updateUsage] = useState([])
  const [loading, updateLoading] = useState(false)
  
  useEffect(() => {
    updateLoading(true)
    ajaxHelper.get('quota-usage', {params: {type: props['data-type']}}).then(response => {
      updateLoading(false)
      return response
    }).then(response => updateUsage(response.data))
  }, [])


  if(loading) return <span className="spinner"/>
  if(usage.length === 0) return null

  return (
    <div className='info-text info-clickable'>
      <i className='monitoring-icon'/> {' '}
      <QuotaTooltip>
      <a href={`/${scope.domain}/${scope.project}/resources/project`}>
        Remaining Quota: {' '}
        {usage.map(quota => quota.label).join(', ')}
      </a>  
    </QuotaTooltip>
    </div>
  )
    // - if @quota_data and @quota_data.length>0
    //              .info-text.info-clickable
    //                %i.monitoring-icon
    //                = link_to "Remaining Quota: #{@quota_data.collect(&:available_as_display_string).join(', ')}", plugin('resources').project_path, data: {toggle: "tooltip", placement: "right"}, title: "Click to manage quotas"
}

createWidget(__dirname, {
  html: {class: 'flex-body'},
  params: {flashescontainer: 'custom'},
  containers: [quotaInfos]
}).then((widget) => {
  widget.configureAjaxHelper()
  widget.setPolicy()
  widget.render(App)
})
