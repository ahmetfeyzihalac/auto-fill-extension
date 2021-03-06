import React, {  useContext, useState } from 'react';
import { string } from 'prop-types';
import { MainContext } from '../../store';
import StorageHelper from '../../helpers/storage.helper';
import { setLoading, updatePersonalData ,updateWizardScreen } from '../../actions';

const WizardNew = ({
  category
}) => {
  const { dispatch, state } = useContext(MainContext);
  const [id, setID] = useState(category);
  const [formData, setFormData] = useState([
    {
      question:'Email address',
      answer: 'example@jotform.com',
    }
  ]);

  const handleBack = () => {
    dispatch(updateWizardScreen('generic'));
  }

  const handleRemoveCard = (index) => {
    const newFormData = formData.reduce((payload, item, i) => {
      const arr = payload;

      if (i !== index) arr.push(item);

      return arr;
    }, []);

    setFormData(newFormData);
  };

  const handleAddNewQuery = (index) => {
    const newFormData = [...formData, ...[{
      question: '',
      answer: '',
      id: category
    }]];

    setFormData(newFormData);
  };

  const handleInputOnChange = (index, type, { target }) => {
    const newFormData = formData.reduce((payload, item, i) => {
      const arr = payload;

      if (index === i) item[type] = target.value;
      arr.push(item);

      return arr;
    }, []);

    setFormData(newFormData);
  };

  const handleCategoryChange = ({ target: { value } }) => {

    setID(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const arr = formData.reduce((payload, item) => {
      const result = [];
      const obj = {};

      const key = item.question.split(' ').join('_').toLocaleLowerCase();
      obj[key] = item.answer;

      result.push(obj);

      return result;
    }, []);

    StorageHelper.save({ type: id || category, data: arr });

    arr.forEach((item) => {
      dispatch(updatePersonalData([ item ]));
    });

    dispatch(setLoading(false));
    dispatch(updateWizardScreen('generic'));
  };

  return (
    <div className="jaf-popup-wizard-new">
      <section>
        <select value={id} onChange={handleCategoryChange}>
          {
            ['personal', 'business', 'incognito'].map((typeItem, typeIndex) => {
              return (
                <option value={typeItem}>{typeItem}</option>
              )
            })
          }
        </select>
      </section>
      <form onSubmit={handleSubmit}>
        {
          formData.map((item, index) => {
            return (
              <div key={index.toString()}>
                <h4>
                  <span>Question</span>
                  <button type="button" onClick={handleRemoveCard.bind(this, index)}>-</button>
                </h4>
                <input type="text" name={item.id} id={item.id} aria-label={item.id} onChange={handleInputOnChange.bind(this, index, 'question')} value={formData[index].question} />
                <h4>Answer</h4>
                <input type="text" name={item.id} id={item.id} aria-label={item.id} onChange={handleInputOnChange.bind(this, index, 'answer')} value={formData[index].answer} />
              </div>
            );
          })
        }
        <section>
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="button" onClick={handleAddNewQuery}>
            + Card
          </button>
          <button type="submit" disabled={state.loading}>
            Save
          </button>
        </section>
      </form>
      {
        formData.length > 1 && (
          <div className="jaf-popup-wizard-new-overlay" />
        )
      }
    </div>
  );
};

WizardNew.propTypes = {
  category: string
};

WizardNew.defaultProps = {
  category: 'business'
};

export default WizardNew;
