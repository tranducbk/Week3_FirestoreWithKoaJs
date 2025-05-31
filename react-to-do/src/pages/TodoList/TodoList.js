import {
    ActionList,
    AppProvider,
    LegacyCard,
    ContextualSaveBar,
    FormLayout,
    Frame,
    Layout,
    Loading,
    Modal,
    Navigation,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    TextContainer,
    TextField,
    Toast,
    TopBar,
    ResourceList,
    Badge,
    Button,
    LegacyStack,
    Card,
  } from '@shopify/polaris';
  import {
    ArrowLeftIcon,
    HomeIcon,
    OrderIcon,
    ChatIcon,
  } from '@shopify/polaris-icons';
  import {useState, useCallback, useRef, useEffect} from 'react';
  import todoService from '../../services/todoService';
  
  function TodoList() {
    const defaultState = useRef({
      emailFieldValue: 'dharma@jadedpixel.com',
      nameFieldValue: 'Jaded Pixel',
    });
    const skipToContentRef = useRef(null);
  
    const [toastActive, setToastActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState(
      defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
      defaultState.current.emailFieldValue,
    );
    const [storeName, setStoreName] = useState(
      defaultState.current.nameFieldValue,
    );
    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');
    const [todos, setTodos] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [newTodo, setNewTodo] = useState("");
  
    const handleSubjectChange = useCallback(
      (value) => setSupportSubject(value),
      [],
    );
    const handleMessageChange = useCallback(
      (value) => setSupportMessage(value),
      [],
    );
    const handleDiscard = useCallback(() => {
      setEmailFieldValue(defaultState.current.emailFieldValue);
      setNameFieldValue(defaultState.current.nameFieldValue);
      setIsDirty(false);
    }, []);
    const handleSave = useCallback(() => {
      defaultState.current.nameFieldValue = nameFieldValue;
      defaultState.current.emailFieldValue = emailFieldValue;
  
      setIsDirty(false);
      setToastActive(true);
      setStoreName(defaultState.current.nameFieldValue);
    }, [emailFieldValue, nameFieldValue]);
    const handleNameFieldChange = useCallback((value) => {
      setNameFieldValue(value);
      value && setIsDirty(true);
    }, []);
    const handleEmailFieldChange = useCallback((value) => {
      setEmailFieldValue(value);
      value && setIsDirty(true);
    }, []);
    const handleSearchResultsDismiss = useCallback(() => {
      setSearchActive(false);
      setSearchValue('');
    }, []);
    const handleSearchFieldChange = useCallback((value) => {
      setSearchValue(value);
      setSearchActive(value.length > 0);
    }, []);
    const toggleToastActive = useCallback(
      () => setToastActive((toastActive) => !toastActive),
      [],
    );
    const toggleUserMenuActive = useCallback(
      () => setUserMenuActive((userMenuActive) => !userMenuActive),
      [],
    );
    const toggleMobileNavigationActive = useCallback(
      () =>
        setMobileNavigationActive(
          (mobileNavigationActive) => !mobileNavigationActive,
        ),
      [],
    );
    const toggleIsLoading = useCallback(
      () => setIsLoading((isLoading) => !isLoading),
      [],
    );
    const toggleModalActive = useCallback(
      () => setModalActive((modalActive) => !modalActive),
      [],
    );
  
    const toastMarkup = toastActive ? (
      <Toast onDismiss={toggleToastActive} content="Changes saved" />
    ) : null;
  
    const userMenuActions = [
      {
        items: [{content: 'Community forums'}],
      },
    ];
  
    const contextualSaveBarMarkup = isDirty ? (
      <ContextualSaveBar
        message="Unsaved changes"
        saveAction={{
          onAction: handleSave,
        }}
        discardAction={{
          onAction: handleDiscard,
        }}
      />
    ) : null;
  
    const userMenuMarkup = (
      <TopBar.UserMenu
        actions={userMenuActions}
        name="Stellar Interiors"
        detail={storeName}
        initials="S"
        open={userMenuActive}
        onToggle={toggleUserMenuActive}
      />
    );
  
    const searchResultsMarkup = (
      <ActionList
        items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
      />
    );
  
    const searchFieldMarkup = (
      <TopBar.SearchField
        onChange={handleSearchFieldChange}
        value={searchValue}
        placeholder="Search"
      />
    );
  
    const topBarMarkup = (
      <TopBar
        showNavigationToggle
        userMenu={userMenuMarkup}
        searchResultsVisible={searchActive}
        searchField={searchFieldMarkup}
        searchResults={searchResultsMarkup}
        onSearchResultsDismiss={handleSearchResultsDismiss}
        onNavigationToggle={toggleMobileNavigationActive}
      />
    );
  
    const loadingMarkup = isLoading ? <Loading /> : null;
  
    const skipToContentTarget = (
      <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
    );
  
    const resourceName = {
      singular: 'todo',
      plural: 'todoes',
    };
  
    const getStatusBadge = (completed) => (
      completed ? <Badge tone="success">Complete</Badge> : <Badge tone="attention">Incomplete</Badge>
    );
  
    const renderItem = (item) => {
      const { id, title, completed } = item;
      return (
        <ResourceList.Item
          id={id}
          accessibilityLabel={`View details for ${title}`}
          persistActions
        >
          <LegacyStack alignment="center">
            <LegacyStack.Item fill>
              <div style={{ fontWeight: 500 }}>{title}</div>
            </LegacyStack.Item>
            <LegacyStack.Item>
              {getStatusBadge(completed)}
            </LegacyStack.Item>
            <LegacyStack.Item>
              <Button size="slim" disabled={completed} primary onClick={() => handleComplete(id)}>Complete</Button>
            </LegacyStack.Item>
            <LegacyStack.Item>
              <Button tone="critical" size="slim" destructive onClick={() => handleDelete(id)}>Delete</Button>
            </LegacyStack.Item>
          </LegacyStack>
        </ResourceList.Item>
      );
    };
  
    const todoListMarkup = (
      <Card>
        <ResourceList
          resourceName={resourceName}
          items={todos}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          renderItem={renderItem}
          selectable
        />
      </Card>
    );
  
    const handleAddTodo = () => {
      if (!newTodo.trim()) return;
      todoService.addTodo(newTodo).then(res => {
        setTodos(todos => [...todos, res.data.data]);
        setNewTodo("");
        setModalActive(false);
      });
    };
  
    const actualPageMarkup = (
      <Page title={"Todoes"} primaryAction={{content: 'Create', onAction: toggleModalActive}}>
        <Layout>
          {skipToContentTarget}
          <Layout.Section>
            {todoListMarkup}
          </Layout.Section>
        </Layout>
      </Page>
    );
  
    const loadingPageMarkup = (
      <SkeletonPage>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={9} />
              </TextContainer>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  
    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;
  
    const modalMarkup = (
      <Modal
        open={modalActive}
        onClose={() => { setModalActive(false); setNewTodo(""); }}
        title="Create todo"
        primaryAction={{
          content: 'Add',
          onAction: handleAddTodo,
          disabled: !newTodo.trim(),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => { setModalActive(false); setNewTodo(""); },
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Title"
              value={newTodo}
              onChange={setNewTodo}
              autoComplete="off"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    );
  
    const logo = {
      width: 86,
      topBarSource:
        'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
      contextualSaveBarSource:
        'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
      accessibilityLabel: 'Shopify',
    };
  
    // Fetch todos khi mount
    useEffect(() => {
      setIsLoading(true);
      todoService.getAllTodos()
        .then(res => setTodos(res.data.data || []))
        .finally(() => setIsLoading(false));
    }, []);
  
    const handleComplete = (id) => {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            const updatedTodo = { ...todo, completed: true };
            todoService.updateTodo(id, updatedTodo).then(() => {
                setTodos(todos => todos.map(todo => todo.id === id ? { ...todo, completed: true } : todo));
            });
        }
    };
  
    const handleDelete = (id) => {
      todoService.deleteTodo(id).then(() => {
        setTodos(todos => todos.filter(todo => todo.id !== id));
      });
    };
  
    const handleBulkComplete = () => {
      Promise.all(selectedItems.map(id => {
        const todo = todos.find(t => t.id === id);
        return todoService.updateTodo(id, { ...todo, completed: true });
      })).then(() => {
        setTodos(todos => todos.map(todo => selectedItems.includes(todo.id) ? { ...todo, completed: true } : todo));
        setSelectedItems([]);
      });
    };
  
    const handleBulkIncomplete = () => {
      Promise.all(selectedItems.map(id => {
        const todo = todos.find(t => t.id === id);
        return todoService.updateTodo(id, { ...todo, completed: false });
      })).then(() => {
        setTodos(todos => todos.map(todo => selectedItems.includes(todo.id) ? { ...todo, completed: false } : todo));
        setSelectedItems([]);
      });
    };
  
    const handleBulkDelete = () => {
      Promise.all(selectedItems.map(id => todoService.deleteTodo(id))).then(() => {
        setTodos(todos => todos.filter(todo => !selectedItems.includes(todo.id)));
        setSelectedItems([]);
      });
    };
  
    const bulkBar = selectedItems.length > 0 && (
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 32,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'none',
      }}>
        <div style={{
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: 12,
          padding: '12px 24px',
          display: 'flex',
          gap: 12,
          pointerEvents: 'auto',
        }}>
          <Button onClick={handleBulkComplete}>Complete</Button>
          <Button onClick={handleBulkIncomplete}>Incomplete</Button>
          <Button destructive onClick={handleBulkDelete}>Delete</Button>
        </div>
      </div>
    );
  
    return (
      <div style={{ width: '100vw', height: '100vh', margin: '0 auto', position: 'relative' }}>
        <AppProvider
          i18n={{
            Polaris: {
              Avatar: {
                label: 'Avatar',
                labelWithInitials: 'Avatar with initials {initials}',
              },
              ContextualSaveBar: {
                save: 'Save',
                discard: 'Discard',
              },
              TextField: {
                characterCount: '{count} characters',
              },
              TopBar: {
                toggleMenuLabel: 'Toggle menu',
  
                SearchField: {
                  clearButtonLabel: 'Clear',
                  search: 'Search',
                },
              },
              Modal: {
                iFrameTitle: 'body markup',
              },
              Frame: {
                skipToContent: 'Skip to content',
                navigationLabel: 'Navigation',
                Navigation: {
                  closeMobileNavigationLabel: 'Close navigation',
                },
              },
            },
          }}
        >
          <Frame
            logo={logo}
            topBar={topBarMarkup}
            showMobileNavigation={mobileNavigationActive}
            // onNavigationDismiss={toggleMobileNavigationActive}
            skipToContentTarget={skipToContentRef}
          >
            {contextualSaveBarMarkup}
            {loadingMarkup}
            {pageMarkup}
            {toastMarkup}
            {modalMarkup}
            {bulkBar}
          </Frame>
        </AppProvider>
      </div>
    );
  }

  export default TodoList;