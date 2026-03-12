import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, URLInputButton } from '@wordpress/block-editor';

const Edit = ( { attributes, setAttributes } ) => {
	const { heading, text, buttonText, buttonUrl } = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-multi-blocks-cta',
		role: 'region',
		'aria-label': __( 'Bloque de llamada a la acción', 'wp-multi-blocks' ),
	} );

	return (
		<section { ...blockProps }>
			<RichText
				tagName="h2"
				value={ heading }
				onChange={ ( value ) => setAttributes( { heading: value } ) }
				placeholder={ __( 'Título de la llamada a la acción…', 'wp-multi-blocks' ) }
			/>
			<RichText
				tagName="p"
				value={ text }
				onChange={ ( value ) => setAttributes( { text: value } ) }
				placeholder={ __( 'Texto descriptivo…', 'wp-multi-blocks' ) }
			/>
			<div className="wp-multi-blocks-cta__actions">
				<RichText
					tagName="span"
					className="wp-multi-blocks-cta__button-text"
					value={ buttonText }
					onChange={ ( value ) => setAttributes( { buttonText: value } ) }
					placeholder={ __( 'Texto del botón', 'wp-multi-blocks' ) }
				/>
				<URLInputButton
					url={ buttonUrl }
					onChange={ ( url ) => setAttributes( { buttonUrl: url } ) }
				/>
			</div>
		</section>
	);
};

export default Edit;

