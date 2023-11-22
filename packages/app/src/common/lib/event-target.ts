class TypedEventTarget<TP extends Event> extends EventTarget {
  public dispatchEvent(e: Event & TP): boolean {
    return super.dispatchEvent(e);
  }

  public dispatch(e: TP): boolean {
    return this.dispatchEvent(Object.assign(new Event(e.type), e));
  }

  // @ts-expect-error do not feel like fixing this
  public addEventListener<
    T extends TP['type'],
    E extends TP & { type: T }
  >(type: T, listener: ((e: E) => boolean) | null) {
    // @ts-expect-error do not feel like fixing this
    super.addEventListener(type, listener);
  }

  public removeEventListener(type: TP['type']) {
    super.removeEventListener(type, null)
  }
}