import React, { useContext } from 'react';
import { MainContext } from '../../store';
import { removeUserData, updateWizardScreen } from '../../actions';
import WizardForm from '../WizardForm';
import Header from '../Header';
import WizardGeneric from '../WizardGeneric';
import WizardNew from '../WizardNew';
import Personal from '../Personal';
import Settings from '../Settings';
import StorageHelper from '../../helpers/storage.helper';
import PodoImg from '../../../../assets/img/podo.png';

const Wizard = () => {
  const { dispatch, state } = useContext(MainContext);

  const handleSettings = () => {
    dispatch(updateWizardScreen('settings'));
  }

  const handleLogout = () => {
    ['user', 'personal', 'wizard', 'toggle', 'settings', 'buttonIsDisabled', 'incognito', 'business'].forEach(key => StorageHelper.remove(key));
    dispatch(removeUserData());
  }

  const renderScreen = () => {
    const components = {
      bio: () => <WizardForm />,
      generic: () => <WizardGeneric />,
      new: () => <WizardNew />,
      personal: () => <Personal />,
      settings: () => <Settings />
    }

    return components[state.wizard.screen] ? components[state.wizard.screen]() : null;
  };

  return (
    <div className="jaf-popup-wizard">
      <Header
        avatarUrl={state.user.avatarUrl}
        PodoImg={PodoImg}
        username={state.user.username}
        email={state.user && state.user.account_type && state.user.account_type.split && state.user.account_type.split('/')[state.user.account_type.split('/').length - 1]}
        handleLogout={handleLogout}
        handleSettings={handleSettings}
      />
      {renderScreen()}
    </div>
  );
};

export default Wizard;
