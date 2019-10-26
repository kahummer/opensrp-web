import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { RoutesProps } from '../../../App/Routes';
import { ENABLE_REPORT_MODULE } from '../../../configs/env';
import { ENABLE_PREGNANCY_MODULE } from '../../../configs/env';
import { headerShouldNotRender } from '../../../helpers/utils';
import SubMenu, { SubMenuProps } from './SubMenu';

import {
  ADMIN_NAVIGATION_MODULE,
  CLIENT_NAVIGATION_MODULE,
  ENABLE_ADMIN_MODULE,
  ENABLE_CLIENT_RECORDS_MODULE,
  HOME_NAVIGATION_MODULE,
  PREGNANCY_NAVIGATION_MODULE,
  REPORT_NAVIGATION_MODULE,
} from './constants';
import './index.css';

/** interface for the local state for this component
 * @property {string} collapsedModuleLabel - label pointing to active navigation module
 */
export interface SideMenuState {
  collapsedModuleLabel: string;
}

const defaultSideMenuState: SideMenuState = {
  collapsedModuleLabel: '',
};

type HeaderPropsTypes = RoutesProps & RouteComponentProps;

class SideMenu extends React.Component<HeaderPropsTypes, SideMenuState> {
  constructor(props: HeaderPropsTypes) {
    super(props);
    this.state = defaultSideMenuState;
  }

  public render() {
    const collapsedModuleLabel = this.state.collapsedModuleLabel;
    interface SubMenuToRender {
      shouldRender: boolean;
      subMenuProps: Partial<SubMenuProps>;
    }
    const navigationModules: SubMenuToRender[] = [
      { shouldRender: true, subMenuProps: HOME_NAVIGATION_MODULE },
      { shouldRender: ENABLE_PREGNANCY_MODULE, subMenuProps: PREGNANCY_NAVIGATION_MODULE },
      { shouldRender: ENABLE_REPORT_MODULE, subMenuProps: REPORT_NAVIGATION_MODULE },
      { shouldRender: ENABLE_CLIENT_RECORDS_MODULE, subMenuProps: CLIENT_NAVIGATION_MODULE },
      { shouldRender: ENABLE_ADMIN_MODULE, subMenuProps: ADMIN_NAVIGATION_MODULE },
    ];
    return (
      <div
        className={`${
          this.props.authenticated && !headerShouldNotRender() && !this.checkHomePageURL(this.props)
            ? 'sidebar'
            : 'hidden-container'
        }`}
      >
        <div className="side-menu-container">
          <Row>
            <Col className="side-menu-extend">
              {navigationModules.map((navigationModule: any, index: number) => {
                if (navigationModule.shouldRender) {
                  return (
                    <SubMenu
                      childNavs={navigationModule.subMenuProps.childNavs}
                      collapsedModuleLabel={collapsedModuleLabel}
                      setCollapsedModuleLabel={this.setCollapsedModuleLabel}
                      parentNav={navigationModule.subMenuProps.parentNav}
                      key={index}
                    />
                  );
                }
              })}
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  /** updates collapsedModuleLabel to label of the new navigation module that should be collapsed */
  private setCollapsedModuleLabel = (label: string) => {
    this.setState({
      collapsedModuleLabel: label,
    });
  };

  private checkHomePageURL = (props: HeaderPropsTypes) => {
    const { location } = props;
    return location.pathname.includes('oauth') || location.pathname === '/';
  };
}

const connectedSideMenu = withRouter((props: HeaderPropsTypes) => <SideMenu {...props} />);

export default connectedSideMenu;