import React, { useEffect, type ReactNode } from 'react';
import clsx from 'clsx';
import { ErrorCauseBoundary, useThemeConfig } from '@docusaurus/theme-common';
import {
  useLockBodyScroll,
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common/internal';
import { translate } from '@docusaurus/Translate';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import NavbarItem, { type Props as NavbarItemConfig } from '@theme/NavbarItem';
import NavbarLogo from '@theme/Navbar/Logo';
import IconClose from '@theme/Icon/Close';
import styles from './styles.module.css';

function useNavbarItems() {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label={translate({
        id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
        message: 'Close navigation bar',
        description: 'The ARIA label for close button of mobile sidebar',
      })}
      className={clsx('clean-btn', styles.closeButton)}
      onClick={onClose}>
      <IconClose color="currentColor" />
    </button>
  );
}

function PrimaryMenu({
  items,
  onNavigate,
}: {
  items: NavbarItemConfig[];
  onNavigate: () => void;
}) {
  return (
    <ul className={clsx('menu__list', styles.menuList)}>
      {items.map((item, index) => (
        <ErrorCauseBoundary
          key={index}
          onError={(error) =>
            new Error(
              `A mobile navbar item failed to render.\n${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )
          }>
          <NavbarItem mobile {...item} onClick={onNavigate} />
        </ErrorCauseBoundary>
      ))}
    </ul>
  );
}

function SecondaryMenu({
  content,
  onBack,
}: {
  content: ReactNode;
  onBack: () => void;
}) {
  return (
    <div className={styles.secondaryMenu}>
      <button type="button" className={clsx('clean-btn', styles.backButton)} onClick={onBack}>
        {translate({
          id: 'theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel',
          message: 'Back to main menu',
          description: 'Label for returning from contextual mobile nav content',
        })}
      </button>
      <div className={styles.secondaryMenuContent}>{content}</div>
    </div>
  );
}

export default function NavbarMobileSidebar(): ReactNode {
  const items = useNavbarItems();
  const mobileSidebar = useNavbarMobileSidebar();
  const secondaryMenu = useNavbarSecondaryMenu();

  useLockBodyScroll(mobileSidebar.shown);

  useEffect(() => {
    if (!mobileSidebar.shown) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        mobileSidebar.toggle();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileSidebar]);

  if (!mobileSidebar.shouldRender) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        role="presentation"
        className={clsx(styles.backdrop, mobileSidebar.shown && styles.backdropVisible)}
        onClick={() => mobileSidebar.toggle()}
      />
      {/* Drawer panel */}
      <aside
        aria-hidden={!mobileSidebar.shown}
        aria-label={translate({
          id: 'theme.navbar.mobileSidebar.ariaLabel',
          message: 'Mobile navigation',
          description: 'The ARIA label for the mobile navigation drawer',
        })}
        aria-modal="true"
        className={clsx(styles.drawer, mobileSidebar.shown && styles.drawerVisible)}
        role="dialog">
        <div className={styles.header}>
          <div className={styles.brand}>
            <NavbarLogo />
          </div>
          <div className={styles.headerActions}>
            <NavbarColorModeToggle className={styles.colorModeToggle} />
            <CloseButton onClose={() => mobileSidebar.toggle()} />
          </div>
        </div>

        <div className={styles.content}>
          {secondaryMenu.shown ? (
            <SecondaryMenu content={secondaryMenu.content} onBack={secondaryMenu.hide} />
          ) : (
            <PrimaryMenu items={items} onNavigate={() => mobileSidebar.toggle()} />
          )}
        </div>
      </aside>
    </>
  );
}
