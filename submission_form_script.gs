function onFormSubmit(e) {
  const { response, source: form } = e
  const items = form.getItems();
  const responses = response.getItemResponses();
  const formId = responses[responses.length - 1].getResponse();

  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(items.map((i) => {
      const r = response.getResponseForItem(i);
      if (r) return r.getResponse();
      return undefined;
    })),
  };

  UrlFetchApp.fetch(`https://murder.dav.sh/submitted/${formId}`, options);
}
