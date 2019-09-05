import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, NavbarToggler, NavItem } from 'reactstrap';
import './SubMenu.css';

export interface SubMenuProps {
  collapse: boolean;
}

export const defaultSubMenuProps: SubMenuProps = {
  collapse: true,
};

export interface SubMenuState {
  isCollapse: boolean;
}

class SubMenu extends React.Component<SubMenuProps, SubMenuState> {
  public static defaultProps = defaultSubMenuProps;
  constructor(props: SubMenuProps) {
    super(props);
    const { collapse } = this.props;
    this.state = {
      isCollapse: collapse,
    };
  }

  public render() {
    return (
      <div>
        <Nav>
          <NavItem onClick={this.toggle}>
            <a className="nav-link side-nav-item">
              <FontAwesomeIcon icon={['far', 'user']} />
              <span> Client Records </span>
            </a>
          </NavItem>
        </Nav>
        <Collapse isOpen={this.state.isCollapse}>
          <Nav>
            <NavItem>
              <NavLink to="/" className="nav-link side-nav-item" activeClassName="side-nav-active">
                <span> All Clients </span>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </div>
    );
  }

  private toggle = () => {
    this.setState({ isCollapse: !this.state.isCollapse });
  };
}

export default SubMenu;
