	async updateQuantity(line, quantity, name)
	{
		let cartBeforeContent = "";
		try
		{
			const response = await fetch("/cart.js");
			if (!response.ok)
			{
				throw new Error("Failed to fetch cart")
			}
			cartBeforeContent = await response.json()
		}
		catch (error)
		{
			console.error("Error fetching the cart:", error)
		}
		this.enableLoading(line);
		const sections = this.getSectionsToRender().map(section => section.section);
		const body = JSON.stringify(
		{
			line: line,
			quantity: quantity,
			sections: sections,
			sections_url: window.location.pathname
		});
		fetch(`${window.routes.cart_change_url}`,
		{
			...fetchConfig(),
			...
			{
				body: body
			}
		}).then(response =>
		{
			return response.text()
		}).then(state =>
		{
			const parsedState = JSON.parse(state);
			this.classList.toggle("is-empty", parsedState.item_count === 0);
			const cartFooter = document.getElementById("main-cart-footer");
			if (cartFooter) cartFooter.classList.toggle("is-empty", parsedState.item_count === 0);
			this.getSectionsToRender().forEach(section =>
			{
				const element = document.getElementById(section.id);
				if (element)
				{
					const elementToReplace = element.querySelector(section.selector) || element;
					if (elementToReplace && parsedState.sections[section.section])
					{
						elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector)
					}
				}
			});
			this.updateLiveRegions(line, parsedState.item_count);
			const lineItem = document.getElementById(`CartItem-${line}`);
			if (lineItem && name) lineItem.querySelector(`[name="${name}"]`).focus();
			this.disableLoading();
			let key = cartBeforeContent.items[line - 1].key;
			document.dispatchEvent(new CustomEvent("cart:updated",
			{
				detail:
				{
					cart: parsedState,
					cartBeforeContent: cartBeforeContent,
					line: key
				}
			}))
		})["catch"](() =>
		{
			this.querySelectorAll(".loading-overlay").forEach(overlay => overlay.classList.add("hidden"));
			this.disableLoading();
			if (this.cartErrors)
			{
				this.cartErrors.textContent = window.cartStrings.error
			}
		})
	}
