import * as React from "react";

export interface Props {
  initialTab?: any;
  children(
    currentTab: any | null,
    changeTabHandler: { (tabId: string): void }
  ): React.ReactElement<any>;
}

export interface State {
  currentTab: any | null;
}

export default class TabsContainer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentTab: props.initialTab
    };

    this.changeTab = this.changeTab.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.initialTab) {
      return;
    }

    this.setState({
      currentTab: nextProps.initialTab
    });
  }

  changeTab(tab: any | null): void {
    this.setState({
      currentTab: tab
    });
  }

  render() {
    const { currentTab } = this.state;

    return this.props.children(currentTab, this.changeTab);
  }
}
