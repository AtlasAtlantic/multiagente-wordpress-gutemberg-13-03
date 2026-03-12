import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';

const Edit = ( { attributes, setAttributes } ) => {
	const {
		postsPerPage,
		postType,
		order,
		orderBy,
		displayExcerpt,
		displayDate,
		displayAuthor,
		noResultsText,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-multi-blocks-post-list',
		'aria-label': __( 'Lista dinámica de entradas', 'wp-multi-blocks' ),
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Configuración de la lista', 'wp-multi-blocks' ) }>
					<RangeControl
						label={ __( 'Número de entradas', 'wp-multi-blocks' ) }
						min={ 1 }
						max={ 20 }
						value={ postsPerPage }
						onChange={ ( value ) => setAttributes( { postsPerPage: value } ) }
					/>
					<SelectControl
						label={ __( 'Tipo de contenido', 'wp-multi-blocks' ) }
						value={ postType }
						options={ [
							{ label: __( 'Entradas', 'wp-multi-blocks' ), value: 'post' },
							{ label: __( 'Páginas', 'wp-multi-blocks' ), value: 'page' },
						] }
						onChange={ ( value ) => setAttributes( { postType: value } ) }
					/>
					<SelectControl
						label={ __( 'Orden', 'wp-multi-blocks' ) }
						value={ order }
						options={ [
							{ label: __( 'Descendente', 'wp-multi-blocks' ), value: 'DESC' },
							{ label: __( 'Ascendente', 'wp-multi-blocks' ), value: 'ASC' },
						] }
						onChange={ ( value ) => setAttributes( { order: value } ) }
					/>
					<SelectControl
						label={ __( 'Ordenar por', 'wp-multi-blocks' ) }
						value={ orderBy }
						options={ [
							{ label: __( 'Fecha', 'wp-multi-blocks' ), value: 'date' },
							{ label: __( 'Título', 'wp-multi-blocks' ), value: 'title' },
						] }
						onChange={ ( value ) => setAttributes( { orderBy: value } ) }
					/>
					<ToggleControl
						label={ __( 'Mostrar extracto', 'wp-multi-blocks' ) }
						checked={ displayExcerpt }
						onChange={ ( value ) => setAttributes( { displayExcerpt: value } ) }
					/>
					<ToggleControl
						label={ __( 'Mostrar fecha', 'wp-multi-blocks' ) }
						checked={ displayDate }
						onChange={ ( value ) => setAttributes( { displayDate: value } ) }
					/>
					<ToggleControl
						label={ __( 'Mostrar autor', 'wp-multi-blocks' ) }
						checked={ displayAuthor }
						onChange={ ( value ) => setAttributes( { displayAuthor: value } ) }
					/>
					<TextControl
						label={ __( 'Texto cuando no hay resultados', 'wp-multi-blocks' ) }
						value={ noResultsText }
						onChange={ ( value ) => setAttributes( { noResultsText: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<section { ...blockProps }>
				<p>{ __( 'La lista de entradas se mostrará en el frontal del sitio.', 'wp-multi-blocks' ) }</p>
			</section>
		</>
	);
};

export default Edit;

