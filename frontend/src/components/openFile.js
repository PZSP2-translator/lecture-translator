export const openFile = (updateNotes) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        updateNotes(reader.result);
      };
      reader.readAsText(file);
    };
    input.click();
}
  