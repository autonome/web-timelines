Web Platform Timelines
=========================

A visual timeline for a given web feature (eg: CSS Grid) that shows:

* Browser implementation milestones (eg developer access, unprefixing, etc)
* Standardization milestones (eg W3C spec revisions and status)
* Google Trends data
* Global availability (eg what % of browsers in-use now support the feature)
* Actual usage (based on Google's public usage data)
* Communication events (eg date added to MDN, major conference talks)

Data Sources
------------

* Browser implementation milestones
  * MDN Compat Data
* Standardization milestones (eg W3C spec revisions and status)
  * Scraping spec URLs
  * TODO: Automate mapping of feature back to spec - on MDN?
* Google Trends data
  * Generate CSV download URL
* Global availability
  * TODO: Caniuse has this, via StatCounter
* Actual usage (based on Google's public usage data)
  * eg https://www.chromestatus.com/metrics/css/timeline/popularity/233
  * TODO: stored publicly? can re-use?
* Communication events
  * TODO:

Visualization
-------------

Overview
* X axis: swimlane-style timelines
* Y axis: plotted values within lane
* Can show multiple streams per lane (eg all browser impl timelines in a single lane)

Implementation
* D3.js or DC.js?

Data sources
* Import feed as stream source
* Import gcal as stream source
* Import gsheet as stream source

Made by [Dietrich Ayala](https://metafluff.com/)
-------------------

\ ゜o゜)ノ
